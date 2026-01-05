import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import {  AuthService  } from './auth.service';
import { ConfigModule,ConfigService } from '@nestjs/config';

@Module({
    imports: [PassportModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
               secret: configService.get('JWT_ENCRYPTION_KEY'),
               signOptions: { 
                expiresIn: configService.get('JWT_EXPIRES_IN'), 
          },
        }),
      }),
    ],

    providers: [AuthService,JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
