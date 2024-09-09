import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { AuthErrors } from '../auth.constants';
import { UserRole } from '@prisma/client';

export class RegisterUserDto {
	@IsEmail({}, { message: AuthErrors.EMAIL_MUST_BE_VALID })
	email: string;

	@IsStrongPassword({ minLength: 6 }, { message: AuthErrors.PASSWORD_MIN_LENGTH })
	@IsString({ message: AuthErrors.PASSWORD_MUST_BE_STRING })
	password: string;

	@IsString({ message: AuthErrors.FULLNAME_MUST_BE_STRING })
	fullName: string;

	@IsEnum(UserRole, { message: AuthErrors.ROLE_IS_EMPTY })
	role: string;
}
