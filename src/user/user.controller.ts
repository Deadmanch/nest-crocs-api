import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userSevice: UserService) {}

	@Get(':id')
	async getById(@Param('id') id: number) {
		return await this.userSevice.getById(id);
	}

	@Get('getByEmail/:email')
	async getByEmail(@Param('email') email: string) {
		return await this.userSevice.getByEmail(email);
	}
}
