import { IUpdateColor } from './interfaces/update-color.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateColor } from './interfaces/create-color.interface';
import { Color as ColorModel } from '@prisma/client';
import { ColorErrors } from './color.constants';

@Injectable()
export class ColorService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(data: ICreateColor): Promise<ColorModel> {
		const existingColor = await this.prismaService.color.findFirst({
			where: { title: data.title },
		});
		if (existingColor) {
			throw new HttpException(ColorErrors.ALLREADY_EXIST, HttpStatus.BAD_REQUEST);
		}

		return await this.prismaService.color.create({ data: data });
	}

	async update(id: number, data: IUpdateColor): Promise<ColorModel | null> {
		const existingColor = await this.prismaService.color.findUnique({ where: { id } });
		if (!existingColor) {
			throw new HttpException(ColorErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.color.update({
			data,
			where: { id },
		});
	}

	async getById(id: number): Promise<ColorModel | null> {
		const existingColor = await this.prismaService.color.findUnique({ where: { id } });
		if (!existingColor) {
			throw new HttpException(ColorErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return existingColor;
	}

	async getByTitle(title: string): Promise<ColorModel | null> {
		const existingColor = await this.prismaService.color.findUnique({ where: { title } });
		if (!existingColor) {
			throw new HttpException(ColorErrors.NOT_FOUND_BY_TITLE, HttpStatus.NOT_FOUND);
		}

		return existingColor;
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
	): Promise<{ total: number; colors: ColorModel[] }> {
		const offset = (page - 1) * limit;
		const colors = await this.prismaService.color.findMany({
			skip: offset,
			take: limit,
		});
		if (!colors) {
			throw new HttpException(ColorErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const total = await this.prismaService.color.count();
		return { total, colors };
	}

	async delete(id: number): Promise<ColorModel | null> {
		const existingColor = await this.prismaService.color.findUnique({ where: { id } });
		if (!existingColor) {
			throw new HttpException(ColorErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.color.delete({ where: { id } });
	}
}
