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

	async searchProductsByTitle(query: string): Promise<ProductModel[] | null> {
		const searhedProducts = await this.prismaService.product.findMany({
			where: { title: { contains: query, mode: 'insensitive' } },
			include: { colors: true, sizes: true, category: true },
			take: 5,
		});
		if (!searhedProducts) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_TITLE, HttpStatus.NOT_FOUND);
		}
		return searhedProducts;
	}

	async getRandomProducts(): Promise<ProductModel[] | null> {
		const products = await this.prismaService.product.findMany({
			take: 4,
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return products;
	}

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
	async getFilterDataByCategory(categoryId: number): Promise<IFilterData | null> {
		const [sizes, colors, maxPriceResult, minPriceResult] = await this.prismaService.$transaction([
			this.prismaService.size.findMany({
				where: { products: { some: { categoryId } } },
				select: { id: true, title: true, inStock: true },
			}),
			this.prismaService.color.findMany({
				where: { products: { some: { categoryId } } },
				select: { id: true, title: true, inStock: true, images: true },
			}),
			this.prismaService.product.findMany({
				where: { categoryId },
				select: { originalPrice: true },
				orderBy: { originalPrice: 'desc' },
				take: 1,
			}),
			this.prismaService.product.findMany({
				where: { categoryId },
				select: { originalPrice: true },
				orderBy: { originalPrice: 'asc' },
				take: 1,
			}),
		]);

		const maxPrice = maxPriceResult[0] ? Math.round(maxPriceResult[0]?.originalPrice) : 0;
		const minPrice = minPriceResult[0] ? Math.round(minPriceResult[0]?.originalPrice) : 0;

		return { sizes, colors, maxPrice, minPrice };
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
		const maxPrice = Math.round(maxPriceResult[0].originalPrice) || 0;
		const minPrice = Math.round(minPriceResult[0].originalPrice) || 0;

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
	}: IFilterProduct): Promise<{ total: number; products: ProductModel[] } | null> {
		const offset = (page - 1) * limit;

		const where: any = {
			originalPrice: {
				gte: minPrice,
				lte: maxPrice,
			},
			colors: colorIds?.length ? { some: { id: { in: colorIds } } } : undefined,
			sizes: sizeIds?.length ? { some: { id: { in: sizeIds } } } : undefined,
		};

		if (categoryId) {
			where.categoryId = categoryId;
		}

		const products = await this.prismaService.product.findMany({
			where,
			skip: offset,
			take: limit,
			include: { colors: true, sizes: true, category: true },
		});

		if (!products) {
			return null;
		}

		const total = await this.prismaService.product.count({
			where,
		});

		return { total, products };
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
	): Promise<{ total: number; products: ProductModel[] }> {
		const offset = (page - 1) * limit;
		const products = await this.prismaService.product.findMany({
			skip: offset,
			take: limit,
			include: { colors: true, sizes: true, category: true },
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const total = await this.prismaService.product.count();
		return { total, products };
	}

	async getById(id: number): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { id },
			include: { colors: true, sizes: true, category: true },
		});
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async getByCategoryId(
		categoryId: number,
		page: number = 1,
		limit: number = 10,
	): Promise<{ total: number; products: ProductModel[] }> {
		const offset = (page - 1) * limit;
		const products = await this.prismaService.product.findMany({
			where: { categoryId },
			skip: offset,
			take: limit,
			include: { colors: true, sizes: true, category: true },
		});
		if (!products) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_CATEGORY_ID, HttpStatus.NOT_FOUND);
		}
		const total = await this.prismaService.product.count({ where: { categoryId } });
		return { total, products };
	}

	async getBySlug(slug: string): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { slug },
			include: { colors: true, sizes: true, category: true },
		});
		if (!product) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_SLUG, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async getByTitle(title: string): Promise<ProductModel | null> {
		const product = await this.prismaService.product.findUnique({
			where: { title },
			include: { colors: true, sizes: true, category: true },
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

		// Проверка существования категории, если она передана для обновления
		if (data.categoryId) {
			const existingCategory = await this.prismaService.category.findUnique({
				where: { id: data.categoryId },
			});
			if (!existingCategory) {
				throw new HttpException(ProductErrors.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
		}

		// Проверка существования цветов, если они переданы для обновления
		if (data.colorIds) {
			const existingColors = await this.prismaService.color.findMany({
				where: { id: { in: data.colorIds } },
			});
			if (existingColors.length !== data.colorIds.length) {
				throw new HttpException(ProductErrors.COLORSIDS_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
		}

		// Проверка существования размеров, если они переданы для обновления
		if (data.sizeIds) {
			const existingSizes = await this.prismaService.size.findMany({
				where: { id: { in: data.sizeIds } },
			});
			if (existingSizes.length !== data.sizeIds.length) {
				throw new HttpException(ProductErrors.SIZESIDS_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
		}

		// Обновление данных продукта
		return await this.prismaService.product.update({
			where: { id },
			data: {
				title: data.title,
				slug: data.slug,
				images: data.images,
				metaTitle: data.metaTitle,
				metaDesc: data.metaDesc,
				seoText: data.seoText,
				originalPrice: data.originalPrice,
				discountedPrice: data.discountedPrice,
				tags: data.tags,
				category: data.categoryId
					? {
							connect: { id: data.categoryId },
						}
					: undefined,
				colors: data.colorIds
					? {
							set: data.colorIds.map((id) => ({ id })),
						}
					: undefined,
				sizes: data.sizeIds
					? {
							set: data.sizeIds.map((id) => ({ id })),
						}
					: undefined,
			},
		});
	}
}
