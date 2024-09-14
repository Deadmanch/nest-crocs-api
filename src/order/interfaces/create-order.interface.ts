import { PaymentMethod } from '@prisma/client';

export interface ICreateOrder {
	fullName: string;
	zipCode: string;
	city: string;
	streetAddress: string;
	email: string;
	state: string;
	phoneNumber: string;
	totalAmount: number;
	paymentMethod: PaymentMethod;
	items: IOrderItem[];
}

export interface IOrderItem {
	productId: number;
	size?: string;
	color?: string;
	quantity: number;
	price: number;
}
