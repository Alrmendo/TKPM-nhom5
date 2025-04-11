import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        // Lấy JWT từ cookie tên 'jwt'
        return req?.cookies?.jwt || null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Trả về dữ liệu user đính kèm vào req.user với id (không phải userId)
    return {
      id: payload.userId, // Map userId from token to id to match User entity
      username: payload.username,
      role: payload.role,
    };
  }
}
