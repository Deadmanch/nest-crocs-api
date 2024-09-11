import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FilesModule } from 'src/files/files.module';

@Module({
	controllers: [ColorController],
	providers: [ColorService],
	imports: [UserModule, PrismaModule, FilesModule],
	exports: [ColorService],
})
export class ColorModule {}
