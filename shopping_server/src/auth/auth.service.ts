import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto'; 
import { UserRole } from 'src/users/enums/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
            sub: user.user_id, // תיקון: מ-'userId' ל-'user_id'
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.user_id, // תיקון: התאמה לשם השדה ב-DB
                username: user.user_name,
                email: user.email,
                role: user.role
            }
        };
    }

    async register(registerDto: RegisterDto) {
        const userToCreate = {
            ...registerDto,
            role: UserRole.USER,
        };
        const user = await this.usersService.create(userToCreate);
        const { password: _, ...result } = user;
        return this.login(result);
    }

    async validateOAuthLogin(email: string, provider: string, profile: any) {
        const user = await this.usersService.findOrCreateOAuthUser(email, provider, profile);
        return this.login(user);
    }
}