import { Controller, Get, Post, Body, Patch, Param, BadRequestException, ParseIntPipe, UploadedFile, ParseFilePipeBuilder, Req, UseInterceptors, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { v4 } from 'uuid';
import { UserSignInDto } from 'src/auth/dto/signin.dto';

const MAX_IMAGE_SIZE_IN_BYTE = 5 * 1024 * 1024

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor("qrcode", {
      fileFilter: ImageFileFilter
    })
  )
  public async createOrderForUser(@Body() body: CreateOrderDto, @Req() req:any,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File, @User() user:UserInfo){
    try{

      if(!file || req.fileValidationError){
        throw new BadRequestException("Invalid file provided, [Image | pdf | doc files allowed]")
      }
      
      const buffer = file.buffer
      const filename = `${v4()}-${file.originalname.replace(/\s+/g,'_')}`

      return this.ordersService.createOrderForUser(filename, buffer, body, user.sub.id)
    }catch(err){
      throw err
    }
  }

  @Post('nonuser')
  @UseInterceptors(
    FileInterceptor("qrcode", {
      fileFilter: ImageFileFilter
    })
  )
  public async createOrderForNonUser(@Body() body: CreateOrderDto, @Req() req:any,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    try{

      if(!file || req.fileValidationError){
        throw new BadRequestException("Invalid file provided, [Image | pdf | doc files allowed]")
      }
      
      const buffer = file.buffer
      const filename = `${v4()}-${file.originalname.replace(/\s+/g,'_')}`

      return this.ordersService.createOrderForNonUser(filename, buffer, body)
    }catch(err){
      throw err
    }
  }

  @Post("checkout/login/:id")
  checkoutLogin(@Param('id', ParseIntPipe) id: number, @Body() userSignInDto: UserSignInDto) {
    return this.ordersService.loginAndCheckout(id, userSignInDto);
  }

  @UseGuards(JwtGuard)
  @Post("checkout/:id")
  checkoutUser(@Param('id', ParseIntPipe) id: number, @Body() checkoutDto: CheckoutDto, @User() user:UserInfo) {
    return this.ordersService.checkout(id, checkoutDto, user.sub.id);
  }

  @Post("checkout/register/:id")
  checkoutNonUser(@Param('id', ParseIntPipe) id: number, @Body() checkoutDto: CheckoutDto) {
    return this.ordersService.checkoutNonUser(id, checkoutDto);
  }

  @UseGuards(JwtGuard)
  @Get("checkout/info/:id")
  findUserOrderForCheckout(@Param('id', ParseIntPipe) id: number, @User() user:UserInfo) {
    return this.ordersService.findOrderForCheckout(id, user.sub.id);
  }

  @Get("checkout/info/nonuser/:id")
  findNonUserOrderForCheckout(@Param('id', ParseIntPipe) id: number,) {
    return this.ordersService.findOrderForCheckout(id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@User() user:UserInfo) {
    return this.ordersService.findUserOrders(user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get("admin")
  findOrdersForAdmin() {
    return this.ordersService.findUserOrders();
  }

  @UseGuards(JwtGuard)
  @Get("admin/revenue")
  findOrdersRevenueForAdmin(@Query("from") from?: string, @Query("to") to?: string) {
    return this.ordersService.findOrdersRevenue(new Date(from as string), new Date(to as string));
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user:UserInfo) {
    return this.ordersService.findUserOrder(id, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get('admin/:id')
  findOrderForAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findUserOrder(id);
  }

  @UseGuards(JwtGuard)
  @Patch('admin/:id')
  updateOrder(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateUserOrder(id, updateOrderDto.status);
  }
}
