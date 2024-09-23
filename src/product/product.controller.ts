import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Patch,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { IFilterData } from './interface/filter-data.interface';
import { ProductModule } from './product.module';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesService } from 'src/files/files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from 'src/files/dto/file-element.response';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductErrors } from './product.constants';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('product')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly filesService: FilesService,
	) {}

	@Get('filter-data')
	async getFilterData(): Promise<IFilterData | null> {
		return this.productService.getFilterData();
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Get('filter')
	async filterProducts(@Query() filterParams: FilterProductDto): Promise<ProductModule[] | null> {
		return this.productService.getFilterProducts(filterParams);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@UseInterceptors(FilesInterceptor('images'))
	@Post('create')
	async create(@Body() data: CreateProductDto, @UploadedFiles() images: Express.Multer.File[]) {
		const imageUrls: FileElementResponse[] = [];
		for (const image of images) {
			const response = await this.filesService.saveAsWebp(image);
			imageUrls.push(response);
		}
		data.images = imageUrls.map((file) => file.url);
		return await this.productService.create(data);
	}

	@UsePipes(new ValidationPipe())
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return await this.productService.delete(Number(id));
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	@UseInterceptors(FilesInterceptor('images'))
	async update(
		@Param('id') id: string,
		@Body() data: UpdateProductDto,
		@UploadedFiles() images: Express.Multer.File[] = [],
	) {
		if (images.length > 0) {
			const imageUrls: FileElementResponse[] = [];
			for (const image of images) {
				const file = await this.filesService.saveAsWebp(image);
				imageUrls.push(file);
			}
			data.images = imageUrls.map((image) => image.url);
		} else {
			delete data.images;
		}

		const updatedProduct = await this.productService.update(Number(id), data);
		if (!updatedProduct) {
			throw new HttpException(ProductErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return updatedProduct;
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.productService.getById(Number(id));
	}

	@Get('byTitle/:title')
	async getByTitle(@Param('title') title: string) {
		return await this.productService.getByTitle(title);
	}

	@Get('bySlug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.productService.getBySlug(slug);
	}

	@Get()
	async getAll(@Query('page') page: string, @Query('limit') limit: string) {
		const pageNumber = Number(page);
		const limitNumber = Number(limit);
		if (isNaN(pageNumber) || isNaN(limitNumber)) {
			throw new HttpException(ProductErrors.INVALID_PARAMS, HttpStatus.BAD_REQUEST);
		}
		return await this.productService.getAll(pageNumber, limitNumber);
	}

	@Get('search')
	async search(@Query('query') query: string) {
		return await this.productService.searchProductsByTitle(query);
	}

	@Get('random')
	async getRandom() {
		return await this.productService.getRandomProducts();
	}
}
