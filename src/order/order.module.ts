import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { CartModule } from 'src/cart/cart.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService],
	imports: [PrismaModule, UserModule, CartModule, AuthModule],
})
export class OrderModule {}
