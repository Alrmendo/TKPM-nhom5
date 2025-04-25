import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        // Thử lấy token từ Authorization header trước
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          console.log('Using token from Authorization header');
          return token;
        }
        
        // Nếu không có Authorization header, thử lấy từ cookie
        const cookieToken = req?.cookies?.jwt;
        if (cookieToken) {
          console.log('Using token from cookie');
          return cookieToken;
        }
        
        console.log('No token found');
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Log thông tin payload để debug
    console.log('JWT Payload:', payload);
    
    // Trả về dữ liệu user đính kèm vào req.user với các trường cần thiết
    return {
      _id: payload.userId, // Đảm bảo _id tồn tại để match với MongoDB
      id: payload.userId,  // Giữ id để tương thích ngược
      userId: payload.userId, // Thêm trường userId 
      username: payload.username,
      role: payload.role,
    };
  }
}
