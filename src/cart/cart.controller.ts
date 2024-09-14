import { JwtAuthGuard } from './../auth/guards/jwt.guard';
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
	@UseGuards(JwtAuthGuard, CartTokenGuard)
	async createCart(@UserEmailAndId() { userId }: UserInfo, @Req() req: Request) {
		const token = req.cartToken;
		return await this.cartService.getCart(userId, token);
	}

	@Post('add-item')
	@UseGuards(JwtAuthGuard, CartTokenGuard)
	async addItem(
		@UserEmailAndId() { userId }: UserInfo,
		@Req() req: Request,
		@Body() dto: CreateCartDto,
	) {
		const token = req.cartToken;
		return await this.cartService.addItem(userId, token, dto);
	}

	@Patch(':itemId')
	@UseGuards(JwtAuthGuard, CartTokenGuard)
	async updateItem(
		@UserEmailAndId() { userId }: UserInfo,
		@Req() req: Request,
		@Param('itemId') itemId: string,
		@Body() dto: UpdateCartDto,
	) {
		const token = req.cartToken;
		return await this.cartService.updateItem(userId, token, itemId, dto);
	}
	@Delete(':itemId')
	@UseGuards(JwtAuthGuard, CartTokenGuard)
	async deleteItem(
		@UserEmailAndId() { userId }: UserInfo,
		@Req() req: Request,
		@Param('itemId') itemId: string,
	) {
		const token = req.cartToken;
		return await this.cartService.removeItem(userId, token, itemId);
	}

	@Get()
	@UseGuards(JwtAuthGuard, CartTokenGuard)
	async getCart(@UserEmailAndId() { userId }: UserInfo, @Req() req: Request) {
		const token = req.cartToken;
		return await this.cartService.getCart(userId, token);
	}
}
