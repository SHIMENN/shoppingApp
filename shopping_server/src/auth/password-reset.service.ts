import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // בקשה לאיפוס סיסמה
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    // אפילו אם המשתמש לא קיים, נחזיר הודעה כללית (אבטחה)
    if (!user) {
      return { message: 'אם האימייל קיים במערכת, נשלח אליך קישור לאיפוס סיסמה' };
    }

    // יצירת טוקן לאיפוס
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // תקף לשעה

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;

    await this.userRepository.save(user);

    // שליחת אימייל - אם נכשל, רק נרשום בלוג אבל לא נזרוק שגיאה
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error.message);
      // ממשיכים בכל זאת - לא רוצים לחשוף שהמשתמש קיים
    }

    return { message: 'אם האימייל קיים במערכת, נשלח אליך קישור לאיפוס סיסמה' };
  }

  // איפוס הסיסמה בפועל
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new BadRequestException('טוקן לא תקין');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('הטוקן פג תוקף');
    }

    // עדכון הסיסמה
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.userRepository.save(user);

    return { message: 'הסיסמה אופסה בהצלחה' };
  }
}
