import { BadRequestException, Injectable } from '@nestjs/common';
import { MonthHistory } from 'src/orders/entities/MonthHistory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YearHistory } from 'src/orders/entities/YearHistory.entity';
import { Order } from 'src/orders/entities/order.entity';

type HistoryData = {
    expense:number,
    orders: number,
    year: number,
    month: number,
    day?: number
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(Order) private readonly orderRepo:Repository<Order>,
  ){}

  async getRecentOrders(userId?:number){
    const recentOrders = await this.orderRepo.find({
        where:{
            ...(userId && {user: {
                id: userId
            }})
        },
        relations: ['orderBilling'],
        order: {
            id: "DESC",
        },
        take: 20,
    })
    
    return recentOrders
  }

  async totalOrders(from?: Date, to?: Date, userId?: number){
    const query =  this.orderRepo.createQueryBuilder("order")
        .select("COUNT(order.id)", "count")

    if (userId) {
        query.where("order.userId = :userId", { userId })
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() })
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }
  
  async successfulOrders(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("COUNT(order.id)", "count")
        .where("order.status = :status", { status: "COMPLETED" })

    if (userId) {
        query.andWhere("order.userId = :userId", { userId })
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() })
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async heldOrders(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("COUNT(order.id)", "count")
        .where("order.status IN (:...statuses)", { statuses: ["CANCELLED", "HELD", "PENDING"] });

    if (userId) {
        query.andWhere("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return parseInt(result.count, 10); // Return the count as a number
  }

  async heldOrdersAdmin(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("COUNT(order.id)", "count")
        .where("order.status IN (:...statuses)", { statuses: ["HELD", "PENDING"] });

    if (userId) {
        query.andWhere("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return parseInt(result.count, 10); // Return the count as a number
  }

  async cancelledOrdersAdmin(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("COUNT(order.id)", "count")
        .where("order.status = :status", { status: "CANCELLED" });

    if (userId) {
        query.andWhere("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return parseInt(result.count, 10); // Return the count as a number
  }

  async projectedExpense(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("SUM(order.amount)", "totalAmount");

    if (userId) {
        query.where("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return result.totalAmount ? parseFloat(result.totalAmount) : 0; // Return the total amount or 0 if null
  }

  async successfulExpense(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("SUM(order.amount)", "totalAmount")
        .where("order.status = :status", { status: "COMPLETED" });

    if (userId) {
        query.andWhere("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return result.totalAmount ? parseFloat(result.totalAmount) : 0; // Return the total amount or 0 if null
  }

  async heldExpense(from?: Date, to?: Date, userId?: number){
    const query = this.orderRepo.createQueryBuilder("order")
        .select("SUM(order.amount)", "totalAmount")
        .where("order.status != :status", { status: "COMPLETED" });

    if (userId) {
        query.andWhere("order.userId = :userId", { userId });
    }

    if (from) {
        query.andWhere("order.createdAt >= :from", { from: from.toISOString() });
    }

    if (to) {
        query.andWhere("order.createdAt <= :to", { to: to.toISOString() });
    }

    const result = await query.getRawOne();
    return result.totalAmount ? parseFloat(result.totalAmount) : 0; // Return the total amount or 0 if null
  }

  async getUserStatistics(from?: Date, to?: Date, userId?: number){
    const totalOrder = await this.totalOrders(from, to, userId) 
    const successfulOrder = await this.successfulOrders(from, to, userId) 
    const heldOrder = await this.heldOrdersAdmin(from, to, userId) 
    const cancelledOrder = await this.cancelledOrdersAdmin(from, to, userId) 
    const projectedEx = await this.projectedExpense(from, to, userId) 
    const successfulEx = await this.successfulExpense(from, to, userId) 
    const heldEx = await this.heldExpense(from, to, userId) 

    return {
        totalOrders:totalOrder,
        successfulOrders: successfulOrder,
        heldOrders: heldOrder,
        cancelledOrders: cancelledOrder,
        projectedExpense: projectedEx.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        successfulExpense: successfulEx.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        heldExpense: heldEx.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    }
  }

  async getHistoryData(timeframe: "MONTH" | "YEAR", month:number, year:number, userId?:number){
    
    if(timeframe === "YEAR"){
      return await this.getYearHistory(year, userId)
    }

    if(Number(month) < 0 || Number(month) > 11){
        throw new BadRequestException({message: "Month should be a valid month"})
    }
    
    if(timeframe === "MONTH"){
        return await this.getMonthHistory(month, year, userId)
    }
  }

  async getMonthHistory(month: number, year: number, userId?: number){
    const result = this.monthHistoryRepo.createQueryBuilder("monthHistory")
        .select("monthHistory.day", "day")
        .addSelect("SUM(monthHistory.orders)", "orders")
        .addSelect("SUM(monthHistory.expense)", "expense")
        .where("monthHistory.month = :month", { month })
        .andWhere("monthHistory.year = :year", { year });

    if (userId) {
        result.andWhere("monthHistory.userId = :userId", { userId });
    }

    result.groupBy("monthHistory.day")
        .orderBy("day", "ASC");

    const aggregatedResult = await result.getRawMany();

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryData[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in month

    for (let i = 1; i <= daysInMonth; i++) {
        let orders = 0;
        let expense = 0;

        const dayData = aggregatedResult.find((row: { day: number }) => row.day === i);
        if (dayData) {
            orders = dayData.orders || 0;
            expense = dayData.expense || 0;
        }

        history.push({
            year,
            month,
            orders,
            expense,
            day: i
        });
    }

    return history;
  }

  async getYearHistory(year: number, userId?: number){
    const result = await this.yearHistoryRepo.createQueryBuilder("yearHistory")
        .select("yearHistory.month", "month")
        .addSelect("SUM(yearHistory.orders)", "orders")
        .addSelect("SUM(yearHistory.expense)", "expense")
        .where("yearHistory.year = :year", { year });

    if (userId) {
        result.andWhere("yearHistory.userId = :userId", { userId });
    }

    result.groupBy("yearHistory.month")
        .orderBy("month", "ASC");

    const aggregatedResult = await result.getRawMany();

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        let orders = 0;
        let expense = 0;

        const month = aggregatedResult.find((row: { month: number }) => row.month === i);
        if (month) {
            orders = month.orders || 0;
            expense = month.expense || 0;
        }

        history.push({
            year,
            month: i,
            orders,
            expense
        });
    }

    return history;
  }

  async getPeriods(){
    const result = await this.monthHistoryRepo.createQueryBuilder("monthHistory")
        .select("DISTINCT monthHistory.year", "year") // Select distinct years
        .orderBy("monthHistory.year", "ASC")
        .getRawMany();

    const years = result.map((el: { year: any }) => el.year);
    
    if (years.length === 0) {
        return [new Date().getFullYear()]; // Return the current year if no years found
    }

    return years;
  }
}
