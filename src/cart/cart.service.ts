import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartErrors } from './cart.constants';
import { ICreateCart } from './interfaces/create-cart.interface';
import { IUpdateCart } from './interfaces/update-cart.interface';
import { Cart as CartModel } from '@prisma/client';

@Injectable()
export class CartService {
	constructor(private readonly prismaService: PrismaService) {}
	private async recalculateTotalAmount(cartId: number): Promise<void> {
		// Получаем все элементы корзины с их продуктами
		const cartItems = await this.prismaService.cartItem.findMany({
			where: { cartId },
			include: { product: true },
		});

		// Вычисляем общую сумму
		const totalAmount = cartItems.reduce((sum, item) => {
			const productPrice = item.product.discountedPrice ?? item.product.originalPrice;
			return sum + item.quantity * productPrice;
		}, 0);

		// Обновляем значение totalAmount в корзине
		await this.prismaService.cart.update({
			where: { id: cartId },
			data: { totalAmount },
		});
	}
	async findCartByUserId(userId: number): Promise<CartModel | null> {
		return await this.prismaService.cart.findFirst({
			where: { userId },
		});
	}
	async createCart(userId: number | null): Promise<CartModel> {
		const token = crypto.randomUUID();
		const cart = await this.prismaService.cart.create({
			data: {
				userId,
				token,
				totalAmount: 0,
			},
		});

		return cart;
	}

	async getCart(userId: number | null, token: string) {
		const cart = await this.prismaService.cart.findFirst({
			where: { userId, token },
			include: {
				cartItems: {
					include: { product: true, color: true, size: true },
				},
			},
		});
		if (!cart) {
			throw new HttpException(CartErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return cart;
	}

	async addItem(userId: number | null, token: string, data: ICreateCart) {
		const cart = await this.getCart(userId, token);
		const { productId, colorId, sizeId, quantity } = data;
		const existingItem = await this.prismaService.cartItem.findUnique({
			where: { cartId_productId_colorId_sizeId: { cartId: cart.id, productId, colorId, sizeId } },
		});

		if (existingItem) {
			await this.prismaService.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity },
			});
		} else {
			await this.prismaService.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					colorId,
					sizeId,
					quantity,
				},
			});
		}

		await this.recalculateTotalAmount(cart.id);

		// Обновляем корзину и возвращаем ее с новыми данными
		const updatedCart = await this.prismaService.cart.findUnique({
			where: { id: cart.id },
			include: { cartItems: { include: { product: true, color: true, size: true } } }, // или укажите необходимые связки
		});

		return updatedCart;
	}

	async updateItem(userId: number | null, token: string, itemId: string, data: IUpdateCart) {
		const cart = await this.getCart(userId, token);
		if (!cart) {
			throw new HttpException(CartErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const updatedItem = await this.prismaService.cartItem.update({
			where: { id: Number(itemId) },
			data,
		});

		if (updatedItem.quantity <= 0) {
			await this.prismaService.cartItem.delete({
				where: { id: Number(itemId) },
			});
		}

		await this.recalculateTotalAmount(cart.id);
		const updatedCart = await this.prismaService.cart.findUnique({
			where: { id: cart.id },
			include: { cartItems: { include: { product: true, color: true, size: true } } }, // или укажите необходимые связки
		});

		return updatedCart;
	}

	async removeItem(userId: number | null, token: string, itemId: string) {
		const cart = await this.prismaService.cart.findFirst({
			where: { userId, token },
		});

		if (!cart) {
			throw new HttpException(CartErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		await this.prismaService.cartItem.delete({
			where: { id: Number(itemId) },
		});

		// Пересчитать общую стоимость после удаления
		await this.recalculateTotalAmount(cart.id);

		const updatedCart = await this.prismaService.cart.findUnique({
			where: { id: cart.id },
			include: { cartItems: { include: { product: true, color: true, size: true } } }, // или укажите необходимые связки
		});

		return updatedCart;
	}
}
