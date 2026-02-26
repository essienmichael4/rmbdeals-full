import { Injectable } from '@nestjs/common';
import { OrderCreatedDto, ResetPasswordEventDto } from './dtos/resetpassword.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}
    
    async sendResetPasswordLink(payload: ResetPasswordEventDto){
        const html = `
            <p>Dear ${payload.name},</p>
            <p>
            You have requested to reset your password for your online account with RMB Deals.
            Please reset your password to access your account by clicking the link below
            (or paste it in your browser's address bar). Link expires in 30 minutes.
            </p>
            <p>
            <a href="${payload.link}">${payload.link}</a>
            </p>
            <p>
            If you have not requested your password to be reset or if you are having
            problems resetting your password, please contact our helpdesk at
            <a href="mailto:rmbdeals1@gmail.com">rmbdeals1@gmail.com</a>.
            </p>
            <p>With kind regards,</p>
            <p>RMBDEALS Team</p>
        `;

        return await this.mailerService.sendMail({
            to: payload.email,
            from: process.env.EMAIL_SENDER,
            subject: "Password reset - RMB DEALS",
            html
        })
    }

    async successfulOrder(payload: OrderCreatedDto){
        const html = `
            <p>Hi ${payload.name},</p>
            <p>Your order with ID: ${payload.order.id} for RMB ${payload.order.rmbEquivalence} at ${payload.order.currency}  ${payload.order.amount} has been placed successfully.</p>
            <p>Please make a payment of ${payload.order.currency} ${payload.order.amount} with reference ${payload.order.id} to the account: ${payload.account.number} with reference name: ${payload.account.name} to proceed with the order processing.</p>
            <p>If no payment is made the order would be automatically cancelled at 12:00 am GMT.</p>
            <p>Follow our WhatsApp channel for regular updates: <a href="https://whatsapp.com/channel/0029VaehZBYC1FuLb5upi23t" target="_blank">https://whatsapp.com/channel/0029VaehZBYC1FuLb5upi23t</a></p>
            <p>Thank you.</p>
            <p>RMBDEALS Team</p>
        `;

        await this.mailerService.sendMail({
            to: payload.email,
            from: process.env.EMAIL_SENDER,
            subject: "Your Order Request - RMB DEALS",
            html
        })

        const htmlAdmin = `
            <p>New order with ID: ${payload.order.id} for RMB ${payload.order.rmbEquivalence} at ${payload.order.currency}  ${payload.order.amount} has been placed by ${payload.name}.</p>
            <p>If no payment is made the order would be automatically cancelled at 12:00 am GMT.</p>
            <p>Thank you.</p>
            <p>RMBDEALS Team</p>
        `;

        await this.mailerService.sendMail({
            to: "sell.rmbdeals@gmail.com",
            from: process.env.EMAIL_SENDER,
            subject: "New Order Request - RMB DEALS",
            html:htmlAdmin
        })
    }

    async statusChange(payload: OrderCreatedDto){
        const html = `
            <p>Hi ${payload.name},</p>
            <p>Your order with ID: ${payload.order.id} for RMB ${payload.order.rmbEquivalence} at ${payload.order.currency}  ${payload.order.amount} has had its status changed to ${payload.status}.</p>
            <p>
            If you have ayn questions about your order, please don't hesitate to contact our helpdesk at
            <a href="mailto:rmbdeals1@gmail.com">rmbdeals1@gmail.com</a>.
            </p>
            <p>Follow our WhatsApp channel for regular updates: <a href="https://whatsapp.com/channel/0029VaehZBYC1FuLb5upi23t" target="_blank">https://whatsapp.com/channel/0029VaehZBYC1FuLb5upi23t</a></p>
            <p>Thank you.</p>
            <p>RMBDEALS Team</p>
        `;

        await this.mailerService.sendMail({
            to: payload.email,
            from: process.env.EMAIL_SENDER,
            subject: "An update on your order - RMB DEALS",
            html
        })
    }
}
