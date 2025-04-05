import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Thank you for registering with our service. Please use the following verification code to verify your account:</p>
          <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 5px;">
            ${verificationCode}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
} 