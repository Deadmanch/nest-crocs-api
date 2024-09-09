import { IsEmail, IsStrongPassword } from 'class-validator';
import { AuthErrors } from '../auth.constants';

export class LoginUserDto {
	@IsEmail({}, { message: AuthErrors.EMAIL_MUST_BE_VALID })
	email: string;

	@IsStrongPassword({ minLength: 6 }, { message: AuthErrors.PASSWORD_MIN_LENGTH })
	password: string;
}
