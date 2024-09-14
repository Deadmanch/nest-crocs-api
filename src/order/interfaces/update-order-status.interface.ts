import { OrderStatus } from '@prisma/client';

export interface IUpdateOrderStatus {
	status: OrderStatus;
}
