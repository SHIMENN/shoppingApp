import {Controller, Post, Body, UseGuards, Request,Get,Res,HttpCode,HttpStatus,} from '@nestjs/common';
import {type Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UsersService } from 'src/users/users.service';


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
async login (@Body () logindto:LoginDto,@Request() req){

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
    const  {access_token, user} = await this.authService.login(loginDto);
    response.cookie('access_token',access_token,{
        httpOnly: true,
        secure: process.env.NODE_ENV ===  'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
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
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
  }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Res() res: Response) {
        const  {access_token, user} = await this.authService.validateOAuthLogin(
            req.user.email,
            'google',
            req.user,
        );

        res.redirect(`http://localhost:3000/oauth-success?access_token=${access_token}`);
    }
}
