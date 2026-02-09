import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { UserRole } from 'src/users/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordResetService } from './password-reset.service';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private passwordResetService: PasswordResetService,
        private emailVerificationService: EmailVerificationService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const { password: _, ...result } = user;
        return result; 
    }

    async login(user: any) {
        // payload עבור ה-JWT. חשוב להשתמש ב-user_id (עם קו תחתון) כפי שמוגדר ב-Entity
        const payload = {
            email: user.email,
            sub: user.user_id,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            userData: {
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                created_at: user.created_at,
                provider: user.provider,
                picture: user.picture,
            }
        };
    }

    async register(registerDto: RegisterDto) {
        const userToCreate = {
            user_name: registerDto.username,
            email: registerDto.email,
            password: registerDto.password,
            role: UserRole.USER,
        };
        const user = await this.usersService.create(userToCreate);

        // שליחת אימייל אימות (לא חוסם את תהליך ההרשמה)
        try {
            await this.emailVerificationService.sendVerificationEmail(user.user_id, user.email);
        } catch (error) {
            console.error('Failed to send verification email during registration:', error.message);
        }

        const { password: _, ...result } = user;
        return this.login(result);
    }

    async validateOAuthLogin(email: string, provider: string, profile: any) {
        const user = await this.usersService.findOrCreateOAuthUser(email, provider, profile);
        return this.login(user);
    }

    // בקשה לאיפוס סיסמה
    async forgotPassword(email: string) {
        return this.passwordResetService.requestPasswordReset(email);
    }

    // איפוס הסיסמה בפועל
    async resetPassword(token: string, newPassword: string) {
        return this.passwordResetService.resetPassword(token, newPassword);
    }

    // אימות אימייל
    async verifyEmail(token: string) {
        return this.emailVerificationService.verifyEmail(token);
    }

    // שליחת אימייל אימות מחדש
    async resendVerificationEmail(email: string) {
        return this.emailVerificationService.resendVerificationEmail(email);
    }
}

