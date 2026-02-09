import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

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

    // שליחת אימייל
    try {
      this.logger.log(`Attempting to send password reset email to: ${email}`);
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      this.logger.log(`Password reset email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error.stack);
      // מוחקים את הטוקן כי לא הצלחנו לשלוח את המייל
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await this.userRepository.save(user);

      // זורקים שגיאה כדי שהמשתמש יידע שיש בעיה
      throw new BadRequestException('שליחת המייל נכשלה. נסה שוב מאוחר יותר');
    }

    return { message: 'נשלח אליך קישור לאיפוס סיסמה למייל' };
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
