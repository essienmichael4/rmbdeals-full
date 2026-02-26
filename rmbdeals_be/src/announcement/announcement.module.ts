import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Marque } from './entities/marque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, User, Marque]), UserModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, UserService, JwtService],
})
export class AnnouncementModule {}
