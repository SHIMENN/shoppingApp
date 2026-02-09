import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // יצירת טוקן אימות ושליחת אימייל
  async sendVerificationEmail(userId: number, email: string) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new BadRequestException('משתמש לא נמצא');
    }

    // אם כבר מאומת
    if (user.isEmailVerified) {
      return { message: 'האימייל כבר מאומת' };
    }

    // יצירת טוקן אימות חדש
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // תקף ל-24 שעות

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;

    await this.userRepository.save(user);

    // שליחת אימייל אימות
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
      return { message: 'אימייל אימות נשלח בהצלחה' };
    } catch (error) {
      console.error('Failed to send verification email:', error.message);
      throw new BadRequestException('שליחת האימייל נכשלה. נסה שוב מאוחר יותר');
    }
  }

  // שליחת אימייל אימות מחדש (למשתמש שכבר רשום)
  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('משתמש לא נמצא');
    }

    if (user.isEmailVerified) {
      return { message: 'האימייל כבר מאומת' };
    }

    return this.sendVerificationEmail(user.user_id, user.email);
  }

  // אימות אימייל בעזרת טוקן
  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('טוקן לא תקין');
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('הטוקן פג תוקף');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await this.userRepository.save(user);

    return { message: 'האימייל אומת בהצלחה' };
  }
}
