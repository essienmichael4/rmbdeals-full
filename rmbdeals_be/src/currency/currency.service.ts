import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { UserService } from 'src/user/user.service';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyUpdate } from './entities/CurrencyUpdate.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency) private readonly currencyRepo:Repository<Currency>,
    @InjectRepository(CurrencyUpdate) private readonly currencyUpdateRepo:Repository<CurrencyUpdate>,
    private userService: UserService,
  ){}
  
  async create(createCurrencyDto: CreateCurrencyDto, userId: number) {
    const user = await this.userService.findUserById(userId)

    const currency = this.currencyRepo.create({
      addedBy: user,
      label:createCurrencyDto.label,
      rate: createCurrencyDto.rate,
      currency: createCurrencyDto.currency,
      description: createCurrencyDto.description
    })

    return await this.currencyRepo.save(currency)
  }

  async findCurrencyForUser(userId:number){
    const user = await this.userService.findUserById(userId);
    return this.currencyRepo.findOne({where: {currency: user.currency}})
  }

  findCurrency(currency:string){
    return this.currencyRepo.findOne({where: {currency}})
  }

  findSingleCurrency(){
    return this.currencyRepo.findOne({where: {id: 1}})
  }

  findAllCurrencies(){
    return this.currencyRepo.find()
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto, userId: number) {
    return await this.currencyRepo.manager.transaction(async (manager) => {
      const user = await this.userService.findUserById(userId);

      const currency = await manager.findOne(this.currencyRepo.target, { where: { currency: id } });
      if (!currency) throw new NotFoundException("Currency not found.");

      const previousRate = currency.rate;

      if (updateCurrencyDto.description !== undefined || updateCurrencyDto.description !== "") {
        currency.description = updateCurrencyDto.description;
      }
      if (updateCurrencyDto.label !== undefined || updateCurrencyDto.label !== "") {
        currency.label = updateCurrencyDto.label;
      }
      if (updateCurrencyDto.rate !== undefined) {
        currency.rate = updateCurrencyDto.rate;
      }

      await manager.save(currency);

      const currencyUpdate = manager.create(this.currencyUpdateRepo.target, {
        previousRate,
        currentRate: currency.rate,
        updatedBy: user,
        currency,
      });

      await manager.save(currencyUpdate);

      return currency;
    });
  }
}
