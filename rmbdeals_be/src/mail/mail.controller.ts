import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedDto, ResetPasswordEventDto } from './dtos/resetpassword.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @OnEvent("reset.password")
  resetPassword(payload:ResetPasswordEventDto){
    return this.mailService.sendResetPasswordLink(payload)
  }

  @OnEvent("order.success")
  successfulOrder(payload:OrderCreatedDto){
    return this.mailService.successfulOrder(payload)
  }

  @OnEvent("order.status")
  statusChange(payload:OrderCreatedDto){
    return this.mailService.successfulOrder(payload)
  }
}
