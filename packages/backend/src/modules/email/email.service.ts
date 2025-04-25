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

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
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

  async sendPasswordResetEmail(
    email: string,
    resetCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p>You requested to reset your password. Please use the following code to reset your password:</p>
          <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 5px;">
            ${resetCode}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you did not request a password reset, please ignore this email and ensure your account is secure.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPaymentReminderEmail(
    email: string,
    orderNumber: string,
    customerName: string,
    remainingAmount: number,
    additionalCharges: number = 0,
    returnCondition: string = 'perfect',
  ): Promise<void> {
    const totalAmount = remainingAmount + additionalCharges;
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(totalAmount);
    const formattedAdditionalCharges =
      additionalCharges > 0
        ? new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(additionalCharges)
        : null;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: `Thanh toán số tiền còn lại cho đơn hàng ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h2 style="color: #c3937c; text-align: center; border-bottom: 2px solid #f8f3f0; padding-bottom: 10px;">Thông báo thanh toán</h2>
          
          <p>Kính gửi ${customerName},</p>
          
          <p>Cảm ơn bạn đã trả váy cho đơn hàng <strong>${orderNumber}</strong>. Váy của bạn đã được kiểm tra với tình trạng: <strong>${returnCondition === 'perfect' ? 'Hoàn hảo' : returnCondition === 'good' ? 'Tốt' : 'Có hư hỏng'}</strong>.</p>
          
          <div style="background-color: #f8f3f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #c3937c; margin-top: 0;">Chi tiết thanh toán:</h3>
            <p><strong>Số tiền còn lại (50%):</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remainingAmount)}</p>
            ${additionalCharges > 0 ? `<p><strong>Phí phụ thu:</strong> ${formattedAdditionalCharges}</p>` : ''}
            <p style="font-size: 18px; font-weight: bold;">Tổng số tiền cần thanh toán: ${formattedAmount}</p>
          </div>
          
          <p>Vui lòng thanh toán số tiền còn lại trong vòng 3 ngày làm việc. Bạn có thể thanh toán qua các phương thức sau:</p>
          
          <ul>
            <li>Chuyển khoản ngân hàng (thông tin trong email xác nhận đơn hàng)</li>
            <li>Thanh toán trực tiếp tại cửa hàng</li>
            <li>Thanh toán qua ví điện tử</li>
          </ul>
          
          <p>Nếu bạn đã thanh toán, vui lòng bỏ qua thông báo này.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:</p>
            <p>Email: support@oxbride.com | Điện thoại: (024) 1234 5678</p>
          </div>
          
          <p style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">© 2025 OX Bride. Bảo lưu mọi quyền.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `Payment reminder email sent to ${email} for order ${orderNumber}`,
      );
    } catch (error) {
      console.error('Failed to send payment reminder email:', error);
      throw new Error('Failed to send payment reminder email');
    }
  }

  async sendDeliveryNotificationEmail(
    email: string,
    orderNumber: string,
    customerName: string,
    deliveryDate: Date = new Date(),
    totalAmount: number,
  ): Promise<void> {
    const formattedDate = deliveryDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedAmount = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(totalAmount * 0.5);

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: `Trang phục của bạn đã được giao - Đơn hàng ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h2 style="color: #c3937c; text-align: center; border-bottom: 2px solid #f8f3f0; padding-bottom: 10px;">Trang phục đã được giao</h2>
          
          <p>Kính gửi ${customerName},</p>
          
          <p>Chúng tôi xin thông báo rằng đơn hàng <strong>${orderNumber}</strong> của bạn đã được giao thành công vào ngày <strong>${formattedDate}</strong>.</p>
          
          <div style="background-color: #f8f3f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #c3937c; margin-top: 0;">Thông tin thanh toán:</h3>
            <p><strong>Số tiền còn lại cần thanh toán (50%):</strong> ${formattedAmount}</p>
            <p>Số tiền này sẽ được thu khi bạn hoàn trả trang phục.</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #c3937c;">Lưu ý quan trọng:</h3>
            <ul>
              <li>Vui lòng kiểm tra tình trạng trang phục ngay khi nhận được.</li>
              <li>Nếu có bất kỳ vấn đề gì, hãy liên hệ với chúng tôi trong vòng 24 giờ.</li>
              <li>Thời hạn hoàn trả trang phục được ghi trong đơn hàng của bạn.</li>
              <li>Khi hoàn trả, vui lòng đảm bảo trang phục sạch sẽ và còn nguyên vẹn.</li>
            </ul>
          </div>
          
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúc bạn có trải nghiệm tuyệt vời!</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua:</p>
            <p>Email: support@oxbride.com | Điện thoại: (024) 1234 5678</p>
          </div>
          
          <p style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">© 2025 OX Bride. Bảo lưu mọi quyền.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `Delivery notification email sent to ${email} for order ${orderNumber}`,
      );
    } catch (error) {
      console.error('Failed to send delivery notification email:', error);
      throw new Error('Failed to send delivery notification email');
    }
  }
}
