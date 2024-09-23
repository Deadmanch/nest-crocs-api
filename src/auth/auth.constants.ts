import { UserRole } from '@prisma/client';

export const AuthErrors = {
	USER_NOT_FOUND: 'User with this email not found',
	INCORRECT_PASSWORD: 'Incorrect password',
	ALLREADY_REGISTERED: 'User with this email already exists',
	FULLNAME_MUST_BE_STRING: 'Fullname must be a string',
	EMAIL_MUST_BE_STRING: 'Email must be a string',
	EMAIL_MUST_BE_VALID: 'Email must be valid',
	PASSWORD_MUST_BE_STRING: 'Password must be a string',
	PASSWORD_MIN_LENGTH: 'Password must contain at least 6 characters',
	NO_PERMISSION: 'No permission',
	ROLE_IS_EMPTY: `Role must be one of ${Object.values(UserRole)}`,
};
