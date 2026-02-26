import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderBilling } from './entities/OrderBillng.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { MonthHistory } from './entities/MonthHistory.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { Currency } from 'src/currency/entities/currency.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { AccountService } from 'src/account/account.service';
import { AccountModule } from 'src/account/account.module';
import { Account } from 'src/account/entities/account.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Account, Order, OrderBilling, YearHistory, MonthHistory, User, Currency]), UserModule, UploadModule, AuthModule, AccountModule],
  controllers: [OrdersController],
  providers: [OrdersService, UserService, JwtService, UploadService, AuthService, AccountService],
})
export class OrdersModule {}
