import { IsOptional, IsString } from 'class-validator';
import { UserErrors } from '../user.constants';

export class UpdateUserDto {
	@IsString({ message: UserErrors.FULL_NAME_MUST_BE_VALID })
	@IsOptional()
	fullName?: string;
	@IsString({ message: UserErrors.EMAIL_MUST_BE_VALID })
	@IsOptional()
	email?: string;
	@IsString({ message: UserErrors.PASSWORD_MUST_BE_STRING })
	@IsOptional()
	password?: string;
}
