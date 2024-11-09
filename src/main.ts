import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Crocs-Api | By Stepanov Danil')
		.setDescription('API for Crocs')
		.setVersion('1.0')
		.addTag('Crocs')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	app.enableCors({
		origin: [
			'http://localhost:5173',
			'http://localhost:3000',
			'https://next-crocs-app.vercel.app/',
		],
		credentials: true,
	});
	app.use(cookieParser());
	const configService = app.get(ConfigService);
	const port = configService.get<number>('APP_PORT') || 3000;
	app.setGlobalPrefix('api');
	await app.listen(port);
}
bootstrap();
