import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User as UserModel, UserRole } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { UserErrors } from './user.constants';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(data: ICreateUser): Promise<UserModel> {
		const salt = await genSalt(10);
		const hashPassword = await hash(data.password, salt);
		return await this.prismaService.user.create({
			data: {
				email: data.email,
				password: hashPassword,
				fullName: data.fullName,
				role: data.role || UserRole.USER,
			},
		});
	}

	async createOrUpdateGoogleUser(email: string, fullName: string): Promise<UserModel> {
		const existingUser = await this.prismaService.user.findUnique({ where: { email } });
		if (existingUser) {
			if (!existingUser.googleAuth) {
				return this.prismaService.user.update({
					where: { email },
					data: { googleAuth: true },
				});
			}
			return existingUser;
		}

		return await this.prismaService.user.create({
			data: {
				email,
				fullName,
				password: '',
				role: UserRole.USER,
				googleAuth: true,
			},
		});
	}

	async getByUserId(userId: number): Promise<UserModel | null> {
		const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } });
		if (!existingUser) {
			return null;
		}
		return existingUser;
	}

	async getByEmail(email: string): Promise<UserModel | null> {
		const existingUser = await this.prismaService.user.findFirst({ where: { email } });
		if (!existingUser) {
			return null;
		}
		return existingUser;
	}

	async updateUser(id: number, data: IUpdateUser) {
		const existingUser = await this.prismaService.user.findUnique({ where: { id } });
		if (!existingUser) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if (data.password) {
			const salt = await genSalt(10);
			const hashPassword = await hash(data.password, salt);
			data.password = hashPassword;
		}

		return await this.prismaService.user.update({ where: { id }, data });
	}

	async deleteUser(id: number) {
		const existingUser = await this.prismaService.user.findUnique({ where: { id } });
		if (!existingUser) {
			throw new HttpException(UserErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return await this.prismaService.user.delete({ where: { id } });
	}
}
