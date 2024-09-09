import { UserRole } from '@prisma/client';

export const AuthErrors = {
	USER_NOT_FOUND: 'Пользователь с таким email не найден',
	INCORRECT_PASSWORD: 'Неверный пароль',
	ALLREADY_REGISTERED: 'Пользователь с таким email уже зарегистрирован',
	FULLNAME_MUST_BE_STRING: 'Имя и фамилия должны быть строками',
	EMAIL_MUST_BE_STRING: 'Email должен быть строкой',
	EMAIL_MUST_BE_VALID: 'Email должен быть валидным',
	PASSWORD_MUST_BE_STRING: 'Пароль должен быть строкой',
	PASSWORD_MIN_LENGTH: 'Пароль должен содержать не менее 6 символов',
	NO_PERMISSION: 'Недостаточно прав для данного действия',
	ROLE_IS_EMPTY: `Роль должна быть - ${UserRole.ADMIN} или ${UserRole.USER}`,
};
