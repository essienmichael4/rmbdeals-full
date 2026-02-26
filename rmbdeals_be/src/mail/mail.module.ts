import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UploadModule } from 'src/upload/upload.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UploadService } from 'src/upload/upload.service';
import { mailerConfig } from './mailer.config';

@Module({
  controllers: [MailController],
  providers: [MailService, UploadService],
  imports: [MailerModule.forRoot(mailerConfig), UploadModule]
})
export class MailModule {}
