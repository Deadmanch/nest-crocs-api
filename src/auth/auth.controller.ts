import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthErrors } from './auth.constants';
import { LoginUserDto } from './dto/login.user.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { IGoogleRequest } from './interfaces/google-user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterUserDto) {
		const oldUser = await this.userService.getByEmail(dto.email);
		if (oldUser) {
			throw new BadRequestException(AuthErrors.ALLREADY_REGISTERED);
		}
		return await this.userService.createUser(dto);
	}

	@Post('login')
	async login(
		@Body() { email, password }: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const user = await this.authService.validateUser(email, password);
		const loginResponse = await this.authService.login(user.email, res);
		return {
			access_token: loginResponse.access_token,
			user: {
				email: user.email,
				userId: user.userId,
			},
		};
	}
	@Get('google')
	@UseGuards(GoogleAuthGuard)
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(GoogleAuthGuard)
	async googleAuthCallback(@Req() req: IGoogleRequest, @Res({ passthrough: true }) res: Response) {
		const user = await this.authService.validateGoogleUser(
			req.user.email,
			req.user.firstName,
			req.user.lastName,
		);
		const loginResponse = await this.authService.login(user.email, res);
		return loginResponse;
	}
}
