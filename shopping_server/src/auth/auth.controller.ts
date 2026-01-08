import {Controller, Post, Body, UseGuards, Request,Get,Res,HttpCode,HttpStatus,} from '@nestjs/common';
import {type Response } from 'express';
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


//  Login - םע Header
@UseGuards(LocalAuthGuard)
@Post('login')
@HttpCode(HttpStatus.OK)
async login (@Request() req){
    return this.authService.login(req.user);
}

@UseGuards(LocalAuthGuard)
@Post('login-cookie')
@HttpCode(HttpStatus.OK)
async loginWithCookie(
    @Request()req,
    @Res({passthrough: true}) response: Response,
){
    const  {access_token, user} = await this.authService.login(req.user);
    response.cookie('access_token',access_token,{
        httpOnly: true,
        secure: process.env.NODE_ENV ===  'production',
        sameSite: 'strict',
        maxAge: 1000*24*24*60,
    });
    return{user};
}
 @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
    @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
