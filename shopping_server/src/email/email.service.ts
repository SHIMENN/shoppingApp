import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'אימות כתובת אימייל',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>ברוך הבא!</h1>
            <p>לחץ על הקישור למטה לאימות האימייל שלך:</p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">
              אמת את האימייל
            </a>
            <p style="margin-top: 20px; color: #666;">הקישור תקף ל-24 שעות</p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              אם לא ביקשת אימות זה, התעלם מהודעה זו.
            </p>
          </div>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'איפוס סיסמה',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>בקשה לאיפוס סיסמה</h1>
            <p>לחץ על הקישור למטה לאיפוס הסיסמה שלך:</p>
            <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">
              אפס סיסמה
            </a>
            <p style="margin-top: 20px; color: #666;">הקישור תקף לשעה אחת</p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              אם לא ביקשת איפוס סיסמה זה, התעלם מהודעה זו.
            </p>
          </div>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}