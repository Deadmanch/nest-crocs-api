import 'express';
declare module 'express' {
	interface Request {
		cartToken: string;
		user?: {
			userId: number;
			email: string;
		};
	}
}
