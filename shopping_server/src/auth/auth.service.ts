import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }
}
