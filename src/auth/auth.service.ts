import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthErrors } from './auth.constants';
import { compare } from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.getByEmail(email);
		if (!user) {
			throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
		}
		const isCorrectPassword = await compare(password, user.password);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(AuthErrors.INCORRECT_PASSWORD);
		}
		return { email: user.email, userId: user.id };
	}

	async validateGoogleUser(email: string, firstName: string, lastName: string) {
		const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'User - ${email}';
		return await this.userService.createOrUpdateGoogleUser(email, fullName);
	}

	async login(email: string, res: Response) {
		const user = await this.userService.getByEmail(email);
		if (!user) {
			throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
		}
		const payload = { email: user.email, userId: user.id };
		const token = await this.jwtService.signAsync(payload);
		res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
		return {
			access_token: token,
		};
	}
}
