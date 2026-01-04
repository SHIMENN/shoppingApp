import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './dto/login.dto';
import {  AuthService  } from './auth.service';


@Module({
    imports: [PassportModule,
        JwtModule.register({
            secret: 'YOUR_SECRET_KEY',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService,JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
