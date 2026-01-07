import {Controller, Post, Body, UseGuards, Request,Get,Res,HttpCode,HttpStatus,} from '@nestjs/common';
import { response, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { register } from 'module';

@Controller('auth')
export class AuthController  {
    constructor (private authService:AuthService){} 
@Post('register')
async register(@Body()registerDto: RegisterDto){
    return this.authService.register(registerDto)
}
@UseGuard(LocalAuthGuard)
@Post('login-cookie')
@HttpCode(HttpStatus.OK)
async loginWithCookie(
    @Request()requestAnimationFrame,
    @Res({passthrough: true}) response: Response,
){
    const  {access_token, user} = await this.authService.login(requestAnimationFrame.user);
    response.cookie('access_token',access_token{
        httpOnly: true,
        secure: process.env.NODE_ENV ===  'production',
        sam
    })
}
}