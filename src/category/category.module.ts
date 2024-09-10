import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService],
	imports: [PrismaModule, UserModule],
})
export class CategoryModule {}
