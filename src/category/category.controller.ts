import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Post('create')
	async create(@Body() data: CreateCategoryDto) {
		return await this.categoryService.create(data);
	}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
		return await this.categoryService.update(Number(id), data);
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.categoryService.getById(Number(id));
	}

	@Get('bySlug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.categoryService.getBySlug(slug);
	}

	@Get()
	async getAll(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.categoryService.getAll(page, limit);
	}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.categoryService.delete(Number(id));
	}
}
