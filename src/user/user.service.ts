import { Injectable } from '@nestjs/common';
import { User as UserModel, UserRole } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateUser } from './interfaces/create-user.interface';

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

	async getById(id: number): Promise<UserModel | null> {
		const existingUser = await this.prismaService.user.findUnique({ where: { id } });
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
}
