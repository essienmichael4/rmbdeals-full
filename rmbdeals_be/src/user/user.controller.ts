import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserCurrencyRequest, UpdateUserDto, UpdateUserPasswordRequest, UpdateUserPhoneRequest, UpdateUserRequest } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("clients/all")
  findAllClientsForAdmin(@Query() pageOptionsDto:PageOptionsDto,) {
    return this.userService.findAll(pageOptionsDto);
  }

  @Get("clients")
  findAllClients() {
    return this.userService.findAllClients();
  }

  @UseGuards(JwtGuard)
  @Get("clients/export")
  exportClients() {
    return this.userService.exportClients();
  }

  @Get("admins")
  findAllAdmins() {
    return this.userService.findAllAdmins();
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.findOne(+id);
  // }

  @UseGuards(JwtGuard)
  @Patch('account')
  update( @Body() updateUserDto: UpdateUserRequest, @User() user:UserInfo) {
    return this.userService.updateUser(user.sub.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Patch('password')
  updatePassword(@Body() updateUserPasswordDto: UpdateUserPasswordRequest, @User() user:UserInfo,) {
    return this.userService.updateUserPassword( updateUserPasswordDto.currentPassword, updateUserPasswordDto.newPassword, updateUserPasswordDto.confirmPassword, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Patch('phone')
  updatePhone(@Body() updateUserPhoneRequest: UpdateUserPhoneRequest, @User() user:UserInfo,) {
    return this.userService.updateUserPhone(user.sub.id, updateUserPhoneRequest);
  }

  @UseGuards(JwtGuard)
  @Patch('currency')
  updateUserCurrency(@Param('id') id: string, @Body() updateUserCurrencyRequest: UpdateUserCurrencyRequest, @User() user:UserInfo,) {
    return this.userService.updateUserCurrency(updateUserCurrencyRequest.currency, user.sub.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
