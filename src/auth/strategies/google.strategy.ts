import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import User from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get('google_client_id'),
      clientSecret: configService.get('google_client_secret'),
      callbackURL: configService.get('google_callback_url'),
      scope: ['profile', 'email']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const { name, emails, photos } = profile;

    const user = await this.authService.validateGoogleUser({
      email: emails[0].value,
      isVerified: !!emails[0].verified,
      firstName: name.givenName,
      lastName: name.familyName,
      photoUrl: photos[0].value
    });

    done(null, user);
  }
}
