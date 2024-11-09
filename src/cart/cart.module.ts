import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	controllers: [CartController],
	providers: [CartService],
	imports: [UserModule, PrismaModule, AuthModule],
	exports: [CartService],
})
export class CartModule {}
