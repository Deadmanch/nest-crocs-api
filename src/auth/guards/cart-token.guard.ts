import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from 'src/cart/cart.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@Injectable()
export class CartTokenGuard implements CanActivate {
	constructor(
		private readonly cartService: CartService,
		private readonly jwtAuthGuard: JwtAuthGuard,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		let userId: number | null = null;

		try {
			// Пробуем применить jwtAuthGuard
			const canActivate = await this.jwtAuthGuard.canActivate(context);
			if (canActivate) {
				// JWT был проверен успешно
				const user = request.user;
				if (user) {
					userId = user.userId;
				}
			}
		} catch (error) {
			// В случае ошибки (например, отсутствия или неверности JWT) просто продолжаем
			console.log('Неверный JWT или его отсутствие. Переходим дальше...');
		}

		let cartToken = request.cookies['cartToken'];

		if (!cartToken) {
			// Проверяем, существует ли корзина для пользователя
			const userCart = userId ? await this.cartService.findCartByUserId(userId) : null;

			if (userCart) {
				cartToken = userCart.token;
			} else {
				// Создаем новую корзину, если корзина не найдена
				const newCart = await this.cartService.createCart(userId);
				cartToken = newCart.token;
			}

			// Устанавливаем cookie с токеном корзины
			request.res?.cookie('cartToken', cartToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000, // 1 день
			});
		}

		request.cartToken = cartToken;
		return true;
	}
}
