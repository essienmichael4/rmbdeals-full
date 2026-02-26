import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @User() user:UserInfo) {
    return this.accountService.create(createAccountDto, user.sub.id);
  }

  @Get()
  findAccount() {
    return this.accountService.findAccount();
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAccountDto: UpdateAccountDto, @User() user:UserInfo) {
    return this.accountService.update(id, updateAccountDto, user.sub.id);
  }
}
