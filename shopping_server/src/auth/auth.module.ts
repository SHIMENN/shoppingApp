import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalAuthStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import {AdminGuard} from './guards/admin.guard';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
      UsersModule,
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:'24h',
          },
        }),
        inject: [ConfigService],
      }),
    ],
    controllers: [AuthController],
    providers: [AuthService,
      JwtStrategy, 
      GoogleStrategy,
      LocalAuthStrategy,
      AdminGuard],
    exports: [AuthService],
})
export class AuthModule {}
