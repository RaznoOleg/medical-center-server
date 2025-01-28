import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const mailerConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get('mail_host'),
    port: configService.get('mail_port'),
    auth: {
      user: configService.get('mail_user'),
      pass: configService.get('mail_password')
    },
    tls: {
      rejectUnauthorized: false
    }
  }
});
