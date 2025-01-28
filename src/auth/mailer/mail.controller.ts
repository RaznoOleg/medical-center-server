import { Controller, Post, Body, HttpCode, Query } from '@nestjs/common';
import MailService from './mail.service';
import { ApiTags } from '@nestjs/swagger';
import SendEmailDto from '../dto/send-email.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/activation')
  @HttpCode(200)
  async sendActivationMail(@Body() emailData: SendEmailDto): Promise<void> {
    await this.mailService.sendActivationMail(emailData);
  }

  @Post('/change-password')
  @HttpCode(200)
  async sendChangePasswordMail(@Body() emailData: SendEmailDto): Promise<void> {
    await this.mailService.sendChangePasswordMail(emailData);
  }
}
