import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthErrors } from './auth.constants';
import { compare } from 'bcryptjs';

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
		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload),
			user: await this.userService.getByEmail(email),
		};
	}
}
