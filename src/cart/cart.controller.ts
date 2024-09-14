import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserEmailAndId, UserInfo } from 'src/decorators/user-email-userId.decorator';
import { CartTokenGuard } from 'src/auth/guards/cart-token.guard';
import { Request } from 'express';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post('create')
	@UseGuards(CartTokenGuard)
	async createCart(@UserEmailAndId() userInfo: UserInfo | null, @Req() req: Request) {
		const token = req.cartToken;
		const userId = userInfo ? userInfo.userId : null;
		return await this.cartService.getCart(userId, token);
	}

	@Post('add-item')
	@UseGuards(CartTokenGuard)
	async addItem(
		@UserEmailAndId() userInfo: UserInfo | null,
		@Req() req: Request,
		@Body() dto: CreateCartDto,
	) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.cartService.addItem(userId, token, dto);
	}

	@Patch(':itemId')
	@UseGuards(CartTokenGuard)
	async updateItem(
		@UserEmailAndId() userInfo: UserInfo | null,
		@Req() req: Request,
		@Param('itemId') itemId: string,
		@Body() dto: UpdateCartDto,
	) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.cartService.updateItem(userId, token, itemId, dto);
	}
	@Delete(':itemId')
	@UseGuards(CartTokenGuard)
	async deleteItem(
		@UserEmailAndId() userInfo: UserInfo | null,
		@Req() req: Request,
		@Param('itemId') itemId: string,
	) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.cartService.removeItem(userId, token, itemId);
	}

	@Get()
	@UseGuards(CartTokenGuard)
	async getCart(@UserEmailAndId() userInfo: UserInfo | null, @Req() req: Request) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.cartService.getCart(userId, token);
	}
}
