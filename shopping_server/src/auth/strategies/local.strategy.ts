import { Strategy as LocalStrategy } from 'passport-local'
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";


@Injectable()
export class LocalAuthStrategy extends PassportStrategy(LocalStrategy){
    constructor(private authService: AuthService){
      super({
        usernameField: 'email',
        passwordField: 'password'
      });
    }
    async validate(email:string, password:string): Promise<any>{
        const user  =await this.authService.validateUser(email,password);

        if (!user){
            throw new UnauthorizedException('Invalid credentials')
        }
        return user
    }
}