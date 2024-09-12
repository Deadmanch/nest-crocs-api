import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { FilesModule } from 'src/files/files.module';

@Module({
	controllers: [ProductController],
	providers: [ProductService],
	imports: [PrismaModule, FilesModule, UserModule],
	exports: [ProductService],
})
export class ProductModule {}
