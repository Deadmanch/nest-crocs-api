import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEmailAndId, UserInfo } from 'src/decorators/user-email-userId.decorator';

@Controller('user')
export class UserController {
	constructor(private readonly userSevice: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getProfile(@UserEmailAndId() userInfo: UserInfo) {
		return await this.userSevice.getByUserId(userInfo.userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('getByEmail')
	async getByEmail(@UserEmailAndId() userInfo: UserInfo) {
		return await this.userSevice.getByEmail(userInfo.email);
	}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		return await this.userSevice.deleteUser(Number(id));
	}
	@UseGuards(JwtAuthGuard)
	@Patch('update')
	async updateUser(@UserEmailAndId() userInfo: UserInfo, @Body() data: UpdateUserDto) {
		return await this.userSevice.updateUser(userInfo.userId, data);
	}
}
