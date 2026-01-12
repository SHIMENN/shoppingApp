import { Injectable, Provider,  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto'; 
import { UserRole } from 'src/users/enums/roles.enum';
import { string } from 'zod';
import { profile } from 'console';


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
        const payload={   //jwt.strategy.ts
            email: user.email,
            sub: user.userId,
            role: user.role,
        };
    return {
        access_token: this.jwtService.sign(payload),
        user: {
            id:  user.userId,
            username:user.username,
            email: user.email,
        }
    }
}
//שלב ההרשמה עם המטודה פלוס  שימוש ב   dto
async  register(registerDto:RegisterDto) {
    const userToCreate = {
        ...registerDto,
        role: UserRole.USER, //תפקיד ברירת מחדל
    };
    const user = await this.usersService.create(userToCreate);
    
    const { password: _, ...result } = user;
    return this.login(result);
  }
  async validateOAuthLogin(
    email: string,
    provider:string,
    profile:string,
  ){
    const user = await this.usersService.findOrCreateOAuthUser(
        email,
         provider,
          profile
        );
    return this.login(user);
  }}