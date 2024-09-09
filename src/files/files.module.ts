import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [FilesController],
	providers: [FilesService],
	imports: [
		ServeStaticModule.forRoot({ rootPath: `${path}/uploads`, serveRoot: '/static' }),
		UserModule,
	],
	exports: [FilesService],
})
export class FilesModule {}
