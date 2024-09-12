export interface IGoogleUser {
	email: string;
	firstName: string;
	lastName: string;
}

export interface IGoogleRequest extends Request {
	user: IGoogleUser;
}
