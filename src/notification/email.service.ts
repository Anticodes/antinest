import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class EmailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "39c51390b5d509",
                pass: "43f6d42c364d19",
            },
        });
    }

    sendEmail(subject: string, html: string, to: string) {
        return this.transporter.sendMail({
            subject,
            html,
            to,
            from: "support@anticodes.net",
        });
    }
}
