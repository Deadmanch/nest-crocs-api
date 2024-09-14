import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CartTokenGuard } from 'src/auth/guards/cart-token.guard';
import { UserInfo } from 'src/decorators/user-email-userId.decorator';
import { Request } from 'express';
import { UserEmailAndId } from 'src/decorators/user-email-userId.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@UseGuards(CartTokenGuard)
	async createOrder(
		@UserEmailAndId() userInfo: UserInfo | null,
		@Req() req: Request,
		@Body() data: CreateOrderDto,
	) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.orderService.createOrder(userId, token, data);
	}

	@Get()
	@UseGuards(CartTokenGuard)
	async getOrdersByUserIdOrToken(@UserEmailAndId() userInfo: UserInfo | null, @Req() req: Request) {
		const userId = userInfo ? userInfo.userId : null;
		const token = req.cartToken;
		return await this.orderService.getOrdersByUserIdOrToken(userId, token);
	}

	@Get(':id')
	@UseGuards(CartTokenGuard)
	async getOrderById(@Param('id') id: string) {
		return await this.orderService.getOrderById(Number(id));
	}
	@Patch(':id')
	@UseGuards(CartTokenGuard)
	async updateOrderStatus(@Param('id') id: string, @Body() { status }: UpdateOrderStatusDto) {
		return await this.orderService.updateOrderStatus(Number(id), status);
	}
}
