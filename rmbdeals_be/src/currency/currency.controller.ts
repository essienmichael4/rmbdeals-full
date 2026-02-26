import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto, @User() user:UserInfo) {
    return this.currencyService.create(createCurrencyDto, user.sub.id);
  }

  @Get()
  findAll() {
    return this.currencyService.findAllCurrencies();
  }

  @Get("unknown")
  findCurrencyForUnknown() {
    return this.currencyService.findSingleCurrency();
  }

  @UseGuards(JwtGuard)
  @Get("user")
  findCurrencyForUser(@User() user:UserInfo) {
    return this.currencyService.findCurrencyForUser(user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto, @User() user:UserInfo) {
    return this.currencyService.update(id, updateCurrencyDto, user.sub.id);
  }
}
