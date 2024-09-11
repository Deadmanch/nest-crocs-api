import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Controller('size')
export class SizeController {
	constructor(private readonly sizeService: SizeService) {}

	@UsePipes(new ValidationPipe())
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Post('create')
	async create(@Body() data: CreateSizeDto) {
		return await this.sizeService.create(data);
	}

	@UsePipes(new ValidationPipe())
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() data: UpdateSizeDto) {
		return await this.sizeService.update(Number(id), data);
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.sizeService.getById(Number(id));
	}

	@Get('byTitle/:title')
	async getByTitle(@Param('title') title: string) {
		return await this.sizeService.getByTitle(title);
	}

	@Get()
	async getAll() {
		return await this.sizeService.getAll();
	}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.sizeService.delete(Number(id));
	}
}
