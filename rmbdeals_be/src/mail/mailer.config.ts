import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path";

export const mailerConfig: MailerOptions = {
    transport: {
        host: "smtp.gmail.com",
        auth: {
            user: "rmbdeals1@gmail.com",
            pass: "eurefsvprbkwemso"
        }
    }, 
    defaults: {
        from: 'rmbdeals1@gmail.com',
    },
    template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true
        }
    }
}
