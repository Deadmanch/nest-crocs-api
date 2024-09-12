import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { ColorModule } from './color/color.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SizeModule } from './size/size.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		FilesModule,
		ProductModule,
		CategoryModule,
		CartModule,
		ColorModule,
		OrderModule,
		PrismaModule,
		SizeModule,
		CartItemModule,
		OrderItemModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
