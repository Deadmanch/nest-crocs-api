import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	const configService = app.get(ConfigService);
	const port = configService.get<number>('APP_PORT') || 3000;
	app.setGlobalPrefix('api');
	await app.listen(port);
}
bootstrap();
