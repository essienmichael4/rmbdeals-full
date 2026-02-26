import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearHistory } from 'src/orders/entities/YearHistory.entity';
import { MonthHistory } from 'src/orders/entities/MonthHistory.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YearHistory, MonthHistory, User, Order]), UserModule],
  controllers: [StatsController],
  providers: [StatsService, JwtService, UserService],
})
export class StatsModule {}
