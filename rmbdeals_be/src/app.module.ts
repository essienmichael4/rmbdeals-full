import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { CurrencyModule } from './currency/currency.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { AccountModule } from './account/account.module';
import { StatsModule } from './stats/stats.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get("DB_HOST"),
        // port: +configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        // entities: [],
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize:true
      })
    }), UserModule, AuthModule, OrdersModule, CurrencyModule, AnnouncementModule, AccountModule, StatsModule, MailModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
