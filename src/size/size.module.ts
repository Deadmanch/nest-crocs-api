import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
	providers: [SizeService],
	controllers: [SizeController],
	imports: [PrismaModule, UserModule],
	exports: [SizeService],
})
export class SizeModule {}
