import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateSize } from './interfaces/create-size.interface';
import { Size as SizeModel } from '@prisma/client';
import { SizeErrors } from './size.constants';
import { IUpdateSize } from './interfaces/update-size.interface';

@Injectable()
export class SizeService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(data: ICreateSize): Promise<SizeModel> {
		const existingSize = await this.prismaService.size.findFirst({ where: { title: data.title } });

		if (existingSize) {
			throw new HttpException(SizeErrors.ALLREADY_EXIST, HttpStatus.BAD_REQUEST);
		}

		return await this.prismaService.size.create({ data });
	}

	async getById(id: number): Promise<SizeModel | null> {
		const existingSize = await this.prismaService.size.findUnique({ where: { id } });
		if (!existingSize) {
			throw new HttpException(SizeErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return existingSize;
	}

	async getByTitle(title: string): Promise<SizeModel | null> {
		const existingSize = await this.prismaService.size.findFirst({ where: { title } });
		if (!existingSize) {
			throw new HttpException(SizeErrors.NOT_FOUND_BY_TITLE, HttpStatus.NOT_FOUND);
		}

		return existingSize;
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
	): Promise<{ total: number; sizes: SizeModel[] }> {
		const offset = (page - 1) * limit;
		const sizes = await this.prismaService.size.findMany({
			skip: offset,
			take: limit,
		});
		if (!sizes) {
			throw new HttpException(SizeErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const total = await this.prismaService.size.count();

		return { total, sizes };
	}

	async update(id: number, data: IUpdateSize): Promise<SizeModel | null> {
		const existingSize = await this.prismaService.size.findUnique({ where: { id } });
		if (!existingSize) {
			throw new HttpException(SizeErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.size.update({
			data,
			where: { id },
		});
	}

	async delete(id: number): Promise<SizeModel | null> {
		const existingSize = await this.prismaService.size.findUnique({ where: { id } });
		if (!existingSize) {
			throw new HttpException(SizeErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return await this.prismaService.size.delete({ where: { id } });
	}
}
