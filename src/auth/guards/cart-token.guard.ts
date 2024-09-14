import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartTokenGuard implements CanActivate {
	constructor(private readonly cartService: CartService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		let cartToken = request.cookies['cartToken'];
		if (!cartToken) {
			const userId = request.user ? request.user.userId : null;
			const newCart = await this.cartService.createCart(userId);
			cartToken = newCart.token;
			request.res?.cookie('cartToken', cartToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			});
		}
		request.cartToken = cartToken;
		return true;
	}
}
