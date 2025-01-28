import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from 'src/common/types';
import { AuthService } from '../auth.service';
import SignInDto from 'src/auth/dto/sign-in.dto';
import { UserService } from 'src/user/user.service';
import User from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['accessToken'];
      }
      if (!token && req && req.query) {
        token = req.query.accessToken;
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt_secret')
    });
  }

  async validate(user: User): Promise<User> {
    const payload = await this.userService.getUserByEmail(user.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
