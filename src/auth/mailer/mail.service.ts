import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import SendEmailDto from '../dto/send-email.dto';

@Injectable()
export default class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendActivationMail(sendEmailDto: SendEmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: this.configService.get('mail_user'),
        to: sendEmailDto.email,
        subject: `Account activation`,
        html: `
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <table align="center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                      <tr>
                        <td style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h2 style="text-align: center; color: #333;">For verification of your account please press the button below</h2>
                            <img src="https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/verify-verified-check-icon.png" alt="Image" style="display: block; margin: 0 auto; width: 100px; margin-bottom: 10px;">
                            <div style="text-align: center;">
                                <a href="${sendEmailDto.link}" style="display: inline-block; font-weight: bold; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 3px;">Verify the account</a>
                            </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
          `
      });
    } catch (error) {
      throw new HttpException(
        'Can not send email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendChangePasswordMail(sendEmailDto: SendEmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: this.configService.get('mail_user'),
        to: sendEmailDto.email,
        subject: `Change password`,
        html: `
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <table align="center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                      <tr>
                        <td style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h3 style="text-align: center; color: #333;">For change password press the button below</h3>
                            <img src="https://icons.veryicon.com/png/o/internet--web/sesame-treasure/login-password-3.png" alt="Image" style="display: block; margin: 0 auto; width: 100px; margin-bottom: 10px;">
                            <div style="text-align: center;">
                            <a href="${sendEmailDto.link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 3px;">Change password</a>
                            </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
          `
      });
    } catch (error) {
      throw new HttpException(
        'Can not send email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
