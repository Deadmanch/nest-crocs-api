import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
	userId: number;
	email: string;
}

export const UserEmailAndId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): UserInfo | null => {
		const request = ctx.switchToHttp().getRequest();
		return request.user || null;
	},
);
