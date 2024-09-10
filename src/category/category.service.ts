import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateCategory } from './interfaces/create-category.interface';
import { Category as CategoryModel } from '@prisma/client';
import { IUpdateCategory } from './interfaces/update-category.interface';
import { CategoryErrors } from './category.constants';

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(data: ICreateCategory): Promise<CategoryModel> {
		return await this.prismaService.category.create({
			data: {
				name: data.name,
				title: data.title,
				slug: data.slug,
				metaTitle: data.metaTitle,
				metaDesc: data.metaDesc,
				seoTextRight: data.seoTextRight,
				seoTextLeft: data.seoTextLeft,
			},
		});
	}

	async getById(id: number): Promise<CategoryModel | null> {
		const existingCategory = await this.prismaService.category.findUnique({ where: { id } });
		if (!existingCategory) {
			throw new HttpException(CategoryErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return existingCategory;
	}

	async getBySlug(slug: string): Promise<CategoryModel | null> {
		const existingCategory = await this.prismaService.category.findFirst({ where: { slug } });
		if (!existingCategory) {
			throw new HttpException(CategoryErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return existingCategory;
	}

	async getAll(page: number = 1, limit: number = 10): Promise<CategoryModel[]> {
		const offset = (page - 1) * limit;
		const categories = await this.prismaService.category.findMany({
			skip: offset,
			take: limit,
		});
		if (!categories) {
			throw new HttpException(CategoryErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return categories;
	}

	async update(id: number, data: IUpdateCategory): Promise<CategoryModel | null> {
		const existingCategory = await this.prismaService.category.findUnique({ where: { id } });
		if (!existingCategory) {
			throw new HttpException(CategoryErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.category.update({
			data,
			where: { id },
		});
	}

	async delete(id: number) {
		return await this.prismaService.category.delete({ where: { id } });
	}
}
