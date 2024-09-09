import { UserRole } from '@prisma/client';

export interface ICreateUser {
	fullName: string;
	email: string;
	password: string;
	role: UserRole;
}
