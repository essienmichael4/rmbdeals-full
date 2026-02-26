import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtGuard)
  @Get()
  findStats(@User() user:UserInfo, @Query("from") from?: string, @Query("to") to?: string) {
    return this.statsService.getUserStatistics(new Date(from), new Date(to), user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get("recent-orders")
  findRecentOrders(@User() user:UserInfo,) {
    return this.statsService.getRecentOrders(user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get("history-data")
  findHistoryData(@User() user:UserInfo, @Query("timeframe") timeframe:"MONTH" | "YEAR", @Query("month") month: number, @Query("year") year: number,) {
    return this.statsService.getHistoryData(timeframe, month, year, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get("history-periods")
  findHistoryPeriods() {
    return this.statsService.getPeriods();
  }

  @UseGuards(JwtGuard)
  @Get("statistics-admin")
  findAdminStatistics(@Query("from") from?: string, @Query("to") to?: string) {
    return this.statsService.getUserStatistics(new Date(from), new Date(to));
  }

  @UseGuards(JwtGuard)
  @Get("recent-orders-admin")
  findRecentOrdersForAdmin() {
    return this.statsService.getRecentOrders();
  }
  
  @UseGuards(JwtGuard)
  @Get("history-data-admin")
  findHistoryDataForAdmin(@Query("timeframe") timeframe:"MONTH" | "YEAR", @Query("month") month: number, @Query("year") year: number,) {
    return this.statsService.getHistoryData(timeframe, month, year);
  }

  @UseGuards(JwtGuard)
  @Get("history-periods-admin")
  findHistoryPeriodsForAdmin() {
    return this.statsService.getPeriods();
  }
}
