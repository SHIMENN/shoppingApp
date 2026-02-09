import {Controller, Post, Body, UseGuards, Request,Get,Res,HttpCode,HttpStatus,Query} from '@nestjs/common';
import {type Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UsersService } from 'src/users/users.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController  {
    constructor (private authService:AuthService , private userService: UsersService){} 



@Post('register')
async register(@Body()registerDto: RegisterDto){
    return this.authService.register(registerDto)
}


//  Login - םע Header
@UseGuards(LocalAuthGuard)
@Post('login')
@HttpCode(HttpStatus.OK)
@Throttle({ default: { limit: 5, ttl: 60000 } })
async login (@Body () loginDto:LoginDto,@Request() req){

    return this.authService.login(req.user);
}

// Login - םע Cookie
@UseGuards(LocalAuthGuard)
@Post('login-cookie')
@HttpCode(HttpStatus.OK)
async loginWithCookie(
    @Body() loginDto: LoginDto,
    @Request()req,
    @Res({passthrough: true}) response: Response,
){
    const  {access_token, userData} = await this.authService.login(req.user);
    response.cookie('access_token',access_token,{
        httpOnly: true,
        secure: process.env.NODE_ENV ===  'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    return{userData};
}


 @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // מביא את כל פרטי המשתמש מהדאטאבייס ולא רק מה-JWT
    const user = await this.userService.findById(req.user.userId);
    if (!user) return null;
    const { password, ...userData } = user;
    return userData;
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
  }

 @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Res() res: Response) {
        const  {access_token, userData} = await this.authService.validateOAuthLogin(
            req.user.email,
            'google',
            req.user,
        );
        res.cookie('access_token', access_token, { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });
        res.redirect(`http://localhost:5173`);
    }
      // 👇 בקשה לאיפוס סיסמה
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // 👇 איפוס סיסמה עם טוקן
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  // 👇 אימות אימייל
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // 👇 שליחת אימייל אימות מחדש
  @Post('resend-verification')
  async resendVerificationEmail(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}


