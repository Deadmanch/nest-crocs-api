import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserInfo } from 'src/decorators/user-email-userId.decorator';

function extractJwtFromCookie(req: Request) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['jwt'];
	}

	return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: extractJwtFromCookie,
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload?: { email: string; userId: number }): Promise<UserInfo | null> {
		// Проверка на наличие и корректность payload
		if (!payload || !payload.email || !payload.userId) {
			throw new UnauthorizedException('Invalid or missing token payload');
		}
		return { userId: payload.userId, email: payload.email };
	}
}
