import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateProduct } from './interface/create-product.interface';
import { Product as ProductModel } from '@prisma/client';
import { ProductErrors } from './product.constants';
import { IFilterData } from './interface/filter-data.interface';
import { IFilterProduct } from './interface/filter-product.interface';
import { IUpdateProduct } from './interface/update-product.interface';

@Injectable()
export class ProductService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(data: ICreateProduct): Promise<ProductModel> {
		return this.prismaService.$transaction(async (prisma) => {
			const existingProduct = await prisma.product.findUnique({
				where: { title: data.title },
			});
			if (existingProduct) {
				throw new HttpException(ProductErrors.ALLREADY_EXIST, HttpStatus.BAD_REQUEST);
			}
			const existingCategory = await prisma.category.findUnique({
				where: { id: data.categoryId },
			});
			if (!existingCategory) {
				throw new HttpException(ProductErrors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
			const existingColors = await prisma.color.findMany({
				where: { id: { in: data.colorIds } },
			});
			if (existingColors.length !== data.colorIds.length) {
				throw new HttpException(ProductErrors.COLORSIDS_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
			const existingSizes = await prisma.size.findMany({
				where: { id: { in: data.sizeIds } },
			});
			if (existingSizes.length !== data.sizeIds.length) {
				throw new HttpException(ProductErrors.SIZESIDS_NOT_FOUND, HttpStatus.NOT_FOUND);
			}

			const product = await prisma.product.create({
				data: {
					title: data.title,
					slug: data.slug,
					originalPrice: data.originalPrice,
					discountedPrice: data.discountedPrice,
					metaTitle: data.metaTitle,
					metaDesc: data.metaDesc,
					seoText: data.seoText,
					tags: data.tags,
					images: data.images,
					category: { connect: { id: data.categoryId } },
					colors: { connect: data.colorIds.map((id) => ({ id })) },
					sizes: { connect: data.sizeIds.map((id) => ({ id })) },
				},
			});
			return product;
		});
	}

	async getFilterData(): Promise<IFilterData | null> {
		const [sizes, colors, maxPriceResult, minPriceResult] = await this.prismaService.$transaction([
			this.prismaService.size.findMany({ select: { id: true, title: true, inStock: true } }),
			this.prismaService.color.findMany({
				select: { id: true, title: true, inStock: true, images: true },
			}),
			this.prismaService.product.findMany({
				select: { originalPrice: true },
				orderBy: { originalPrice: 'desc' },
				take: 1,
			}),
			this.prismaService.product.findMany({
				select: { originalPrice: true },
				orderBy: { originalPrice: 'asc' },
				take: 1,
			}),
		]);
		const maxPrice = maxPriceResult[0].originalPrice;
		const minPrice = minPriceResult[0].originalPrice;

		return { sizes, colors, maxPrice, minPrice };
	}

	async getFilterProducts({
		categoryId,
		minPrice,
		maxPrice,
		colorIds,
		sizeIds,
		page = 1,
		limit = 10,
	}: IFilterProduct): Promise<ProductModel[] | null> {
		const products = await this.prismaService.product.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				AND: [
					{ categoryId },
					minPrice ? { originalPrice: { gte: minPrice } } : {},
					maxPrice ? { originalPrice: { lte: maxPrice } } : {},
					colorIds ? { colors: { some: { id: { in: colorIds } } } } : {},
					sizeIds ? { sizes: { some: { id: { in: sizeIds } } } } : {},
				],
			},
			include: {
				colors: true,
				sizes: true,
			},
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return products;
	}

	async getAll(page: number = 1, limit: number = 10): Promise<ProductModel[]> {
		const skip = (page - 1) * limit;
		const products = await this.prismaService.product.findMany({
			skip,
			take: limit,
			include: {
				colors: true,
				sizes: true,
			},
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return products;
	}

	async getById(id: number): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { id },
			include: { colors: true, sizes: true },
		});
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async getBySlug(slug: string): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { slug },
			include: { colors: true, sizes: true },
		});
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_SLUG, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async getByTitle(title: string): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { title },
			include: { colors: true, sizes: true },
		});
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_TITLE, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async delete(id: number): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({ where: { id } });
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}
		return await this.prismaService.product.delete({ where: { id } });
	}

	async update(id: number, data: IUpdateProduct): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({ where: { id } });
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}
		return await this.prismaService.product.update({ where: { id }, data });
	}

	async getRandomProducts(): Promise<ProductModel[] | null> {
		const products = await this.prismaService.product.findMany({
			include: { colors: true, sizes: true },
			take: 4,
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return products;
	}
	async searchProductsByTitle(query: string): Promise<ProductModel[] | null> {
		const searhedProducts = await this.prismaService.product.findMany({
			where: { title: { contains: query } },
			include: { colors: true, sizes: true },
		});
		if (!searhedProducts) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_TITLE, HttpStatus.NOT_FOUND);
		}
		return searhedProducts;
	}
}
