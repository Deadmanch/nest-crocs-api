import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
		PassportModule,
	],
})
export class AuthModule {}
