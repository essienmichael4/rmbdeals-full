import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CheckoutDto, CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UploadService } from 'src/upload/upload.service';
import { Currency } from 'src/currency/entities/currency.entity';
import { Order, Status } from './entities/order.entity';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { MonthHistory } from './entities/MonthHistory.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { UserSignInDto } from 'src/auth/dto/signin.dto';
import { AuthService } from 'src/auth/auth.service';
import { OrderBilling } from './entities/OrderBillng.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountService } from 'src/account/account.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { endOfDay, startOfDay, subDays,  } from 'date-fns';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Currency) private readonly currencyRepo:Repository<Currency>,
    @InjectRepository(Order) private readonly orderRepo:Repository<Order>,
    @InjectRepository(OrderBilling) private readonly orderBillingRepo:Repository<OrderBilling>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    private readonly uploadService:UploadService,
    private readonly authService:AuthService,
    private readonly accountService:AccountService,
    private eventEmitter:EventEmitter2,
    private readonly dataSource:DataSource
  ){}

  async createOrderForUser(filename: string, buffer:Buffer<ArrayBufferLike>, data:CreateOrderDto, userId: number){
    const queryRunner = this.dataSource.createQueryRunner()

    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()
      await this.uploadService.addAttachment(buffer, filename) 

      if(data.amount < 400) throw new BadRequestException("The transacted amount so lower than the minimum amount needed to make transactions. Minimum transacted amount is Gh¢ 200.")

      const currency = await queryRunner.manager.findOne(Currency, {
        where: { currency: data.currency }
      });

      if(!currency) throw new NotFoundException("The transacted currency was not found.")

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId }
      });

      const rmbEquivalence = data.amount * currency.rate
      const order = await this.createOrder(queryRunner, data.account, data.amount, currency.rate, rmbEquivalence, data.recipient, currency.currency, filename, user)
      await Promise.all([
        this.upsertYearHistory(data.amount, user.id, queryRunner),
        this.upsertMonthHistory(data.amount, user.id, queryRunner),
      ]);
      await queryRunner.commitTransaction()

      return order
    }catch(err){
      await queryRunner.rollbackTransaction()
      await this.uploadService.deleteAttachment(filename)
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async createOrderForNonUser(filename: string, buffer:Buffer<ArrayBufferLike>, data:CreateOrderDto){
    const queryRunner = this.dataSource.createQueryRunner()

    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()
      await this.uploadService.addAttachment(buffer, filename) 

      if(data.amount < 400) throw new BadRequestException("The transacted amount so lower than the minimum amount needed to make transactions. Minimum transacted amount is Gh¢ 200.")

      const currency = await queryRunner.manager.findOne(Currency, {
        where: { currency: data.currency }
      });

      if(!currency) throw new NotFoundException("The transacted currency was not found.")

      const rmbEquivalence = data.amount * currency.rate
      const order = await this.createOrder(queryRunner, data.account, data.amount, currency.rate, rmbEquivalence, data.recipient, currency.currency, filename)
      await queryRunner.commitTransaction()
      return order
      
    }catch(err){
      await queryRunner.rollbackTransaction()
      await this.uploadService.deleteAttachment(filename)
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async createOrder(queryRunner: QueryRunner, account: string, amount: number, rate: number, rmbEquivalence: number, recipient: string, currency: string, qrCode: string, user?: User){
    const saveEntity = this.orderRepo.create({
      account,
      amount, 
      rate,
      recipient,
      rmbEquivalence,
      currency,
      qrCode,
      product: process.env.PRODUCT as string,
      status: "HELD",
      ...(user && {user})
    })

    return await queryRunner.manager.save(Order, {
      ...saveEntity
    })
  }

  async loginAndCheckout(id:number, userSignInDto: UserSignInDto) {
    try {
      const loginResponse = await this.authService.login(userSignInDto)
      const user = await this.userRepo.findOne({where: {id: loginResponse.id}})
      const order = await this.findOrderForCheckout(id)      
      const queryRunner = this.dataSource.createQueryRunner()

      try{
        await queryRunner.connect()
        await queryRunner.startTransaction()
        await this.checkoutLoginOrderUpdate(queryRunner, order, user)
        await queryRunner.commitTransaction()
      }catch(err){
        await queryRunner.rollbackTransaction()
        throw err
      }finally{
        await queryRunner.release()
      }
      
      return loginResponse;
    } catch (error) {
      if(error.meta.modelName === "Order"){
        throw new NotFoundException("No order record was found with the ID associated with this account")
      }else{
        throw error
      }
    }
  }

  async checkoutLoginOrderUpdate(queryRunner:QueryRunner, order: Order, user: User){
    await queryRunner.manager.save(Order, {...order, user})
    await Promise.all([
      this.upsertYearHistory(order.amount, user.id, queryRunner),
      this.upsertMonthHistory(order.amount, user.id, queryRunner),
    ]);
  }

  async checkout(id: number, checkoutDto: CheckoutDto, userId:number){
    try {
      const user = await this.userRepo.findOne({where: {id: userId}})
      const order = await this.orderBilling(id, checkoutDto.name, checkoutDto.email, checkoutDto.whatsapp, checkoutDto.momoName, checkoutDto.notes, user)
      const account = await this.accountService.findAccount()
      this.eventEmitter.emit("order.success", {email: user.email, name: user.name, order, account})
      return {order, message:"Order placed successfully"}
    } catch (error) {
      throw error
    }
  }

  async checkoutNonUser(id: number, checkoutDto: CheckoutDto,){
    try {
      const registerResponse = await this.authService.registerUser({name: checkoutDto.name, email: checkoutDto.email, password: checkoutDto.password, confirmPassword: checkoutDto.password})
      await this.userRepo.update(registerResponse.id, {phone: checkoutDto.whatsapp})
      const user = await this.userRepo.findOne({where: {id: registerResponse.id}})
      const order = await this.orderBilling(id, checkoutDto.name, checkoutDto.email, checkoutDto.whatsapp, checkoutDto.momoName, checkoutDto.notes, user)
      const account = await this.accountService.findAccount()
      this.eventEmitter.emit("order.success", {email: user.email, name: user.name, order, account})
      const queryRunner = this.dataSource.createQueryRunner()

      try{
        await queryRunner.connect()
        await queryRunner.startTransaction()
        await this.checkoutLoginOrderUpdate(queryRunner, order, user)
        await queryRunner.commitTransaction()
      }catch(err){
        await queryRunner.rollbackTransaction()
        throw err
      }finally{
        await queryRunner.release()
      }

      return {user: registerResponse, order, message:"Order placed successfully"}
    } catch (error) {
      throw error
    }
  }

  async findOrderForCheckout(id: number, userId?: number){
    const order = await this.orderRepo.findOne({
      where: {
        id,
        ...(userId && { user: {id: userId}}), 
      }
    })
    return order
  }

  async findOrdersRevenue(from?:Date, to?: Date) {
    return {
        completedRevenue: await this.completedRevenue(from, to),
        heldRevenue: await this.heldRevenue(from, to)
    }
  }

  async findUserOrders(userId?:number){
    return await this.orderRepo.find({
        where:{
            user: {
                id: userId
            }
        },
        relations: ['orderBilling'], 
        order: {
            id: "DESC", 
        },
    })
  }

  async findUserOrder(id: number, userId?: number) {
      const order = await this.orderRepo.findOne({
          where: {
              id,
              user: {
                  id: userId
              }       
          },
          relations: ['orderBilling'],
      });

      order.qrCode = await this.uploadService.getSignedUrl(order.qrCode);

      return order
  }

  async findUserRecentOrders (userId?: number) {    
    const recentOrders = await this.orderRepo.find({
        where:{
            user: {
                id: userId
            }
        },
        relations: ['orderBilling'],
        order: {
            id: "DESC",
        },
        take: 20,
    })
    
    return recentOrders
  };

  async orderBilling(id: number, name: string, email: string, whatsapp: string, momoName: string, notes?: string, user?: User){
    const order = await this.orderRepo.findOne({
      relations: {
        user:true
      },
      where: {
        id,
        ...(user && { user: {id: user.id}}), 
      }
    })
    if(!order) throw new NotFoundException()

    const billingEntity = this.orderBillingRepo.create({
      name,
      whatsapp,
      momoName,
      email,
      notes: notes || '',
      order
    })

    const billing = await this.orderBillingRepo.save(billingEntity)
    order.orderBilling = billing
    await this.orderRepo.save(order)
    return order
  }

  async completedRevenue(from?: Date, to?: Date) {
      const query =  this.orderRepo.createQueryBuilder("order")
          .select("order.currency", "currency")
          .addSelect("SUM(order.amount)", "totalRevenue")
          .where("order.status = :status", { status: "COMPLETED" })

      if (from) {
          query.andWhere("order.createdAt >= :from", { from: from.toISOString() })
      }

      if (to) {
          query.andWhere("order.createdAt <= :to", { to: to.toISOString() })
      }

      query.groupBy("order.currency")

      const result = await query.getRawMany()
      return result
  }

  async heldRevenue(from?: Date, to?: Date) {

      const query = this.orderRepo.createQueryBuilder("order")
          .select("order.currency", "currency")
          .addSelect("SUM(order.amount)", "totalRevenue")
          .where("order.status IN (:...statuses)", { statuses: ["CANCELLED", "HELD", "PENDING"] })

      if (from) {
          query.andWhere("order.createdAt >= :from", { from: from.toISOString() })
      }

      if (to) {
          query.andWhere("order.createdAt <= :to", { to: to.toISOString() })
      }

      query.groupBy("order.currency")

      const result = await query.getRawMany()
      return result
  }

  async updateUserOrder(id: number, status: Status) {
    const order = await this.orderRepo.findOne({
      relations: {user: true},
      where: {id}
    })
    const result = await this.orderRepo.update(id, { status });
    this.eventEmitter.emit("order.status", {email: order.user.email, name: order.user.name, order, status})
    return result
  }

  async upsertMonthHistory(amount: number, userId:number, queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year, userId }
    })

    if(monthHistory){
      monthHistory.orders += 1
      monthHistory.expense += amount
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, orders: 1, expense: amount, userId
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }
  }

  async upsertYearHistory(amount: number, userId:number, queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year, userId }
    })

    if(yearHistory){
      yearHistory.orders += 1
      yearHistory.expense += amount
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
        month, year, orders: 1, userId, expense: amount
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'daily-order-update' }) // every midnight
  async deleteOrderImagesAndUpdateStatus() {
    const to = endOfDay(new Date());            // today 23:59:59
    const from = startOfDay(subDays(new Date(), 1)); // yesterday 00:00:00

    const query = this.orderRepo.createQueryBuilder("order")
      .where("order.createdAt BETWEEN :from AND :to", {
        from,
        to,
      });

    const orders = await query.getMany();

    await Promise.all(
      orders.map(async (order) => {
        if (order.qrCode) {
          await this.uploadService.deleteAttachment(order.qrCode);
        }
        
      })
    );    

    // Clear QR codes for all orders
    await this.orderRepo
      .createQueryBuilder()
      .update()
      .set({ qrCode: "" })
      .execute();

    // Cancel all HELD orders
    await this.orderRepo
      .createQueryBuilder()
      .update()
      .set({ status: "CANCELLED" })
      .where("status = :status", { status: "HELD" })
      .execute();

  }
}
