import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICreateOrder } from './interfaces/create-order.interface';
import { OrderErrors } from './order.constants';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
	constructor(private readonly prismaService: PrismaService) {}

	async createOrder(userId: number | null, token: string, data: ICreateOrder) {
		const order = await this.prismaService.order.create({
			data: {
				fullName: data.fullName,
				zipCode: data.zipCode,
				city: data.city,
				streetAddress: data.streetAddress,
				email: data.email,
				state: data.state,
				phoneNumber: data.phoneNumber,
				totalAmount: data.totalAmount,
				paymentMethod: data.paymentMethod,
				userId,
				token,
				orderItem: {
					create: data.items.map((item) => ({
						productId: item.productId,
						size: item.size,
						color: item.color,
						quantity: item.quantity,
						price: item.price,
					})),
				},
			},
			include: {
				orderItem: true,
			},
		});
		return order;
	}

	async getOrdersByUserIdOrToken(
		userId: number | null,
		token: string,
		limit: number = 10,
		page: number = 1,
	) {
		const offset = (page - 1) * limit;
		const orders = await this.prismaService.order.findMany({
			where: {
				userId,
				token,
			},
			include: {
				orderItem: true,
			},
			skip: offset,
			take: limit,
		});
		if (!orders) {
			throw new HttpException(OrderErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return orders;
	}

	async getOrderById(id: number) {
		const order = await this.prismaService.order.findUnique({
			where: {
				id,
			},
			include: {
				orderItem: true,
			},
		});
		if (!order) {
			throw new HttpException(OrderErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return order;
	}
	async updateOrderStatus(orderId: number, status: OrderStatus) {
		const order = await this.prismaService.order.findUnique({ where: { id: orderId } });
		if (!order) {
			throw new HttpException(OrderErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.order.update({
			where: { id: orderId },
			data: { orderStatus: status },
		});
	}
}
