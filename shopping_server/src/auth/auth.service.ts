import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto'; 


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}
    async validateUser(email: string, password: string): Promise<any> {
        const user =  await this.usersService.findByEmail(email);
        
        if (!user){
            return null;
        }
        const isPasswordValid =   await bcrypt.compare(password,user.password);

        if (!isPasswordValid){
            return null;
        }
        const {password:_, ...result} = user;
        return result; 
 }
    async login(user:any){
        const payload={
            email: user.email,
            sub: user.id
        };
    return {
        access_token: this.jwtService.sign(payload),
        user: {
            id:  user.id,
            username:user.username,
            email: user.email,
        }
    }
}
//שלב ההרשמה עם המטודה פלוס  שימוש ב   dto
async register(registerDto:RegisterDto) {
    const user = await this.usersService.create(registerDto);
    
    const { password: _, ...result } = user;
    return this.login(result);
  }
}