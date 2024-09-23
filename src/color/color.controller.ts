import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateColorDto } from './dto/create-color.dto';
import { FilesService } from '../files/files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from 'src/files/dto/file-element.response';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorErrors } from './color.constants';

@Controller('color')
export class ColorController {
	constructor(
		private readonly colorService: ColorService,
		private readonly filesService: FilesService,
	) {}
	@UsePipes(new ValidationPipe({ transform: true }))
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Post('create')
	@UseInterceptors(FilesInterceptor('images'))
	async create(@Body() data: CreateColorDto, @UploadedFiles() images: Express.Multer.File[]) {
		const imageUrls: FileElementResponse[] = [];
		for (const image of images) {
			const response = await this.filesService.saveAsWebp(image);
			imageUrls.push(response);
		}
		data.images = imageUrls.map((file) => file.url);
		return await this.colorService.create(data);
	}

	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.colorService.delete(Number(id));
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Roles(UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Patch(':id')
	@UseInterceptors(FilesInterceptor('images'))
	async update(
		@Param('id') id: string,
		@Body() data: UpdateColorDto,
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
		const updatedColor = await this.colorService.update(Number(id), data);
		if (!updatedColor) {
			throw new HttpException(ColorErrors.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
		}

		return updatedColor;
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.colorService.getById(Number(id));
	}

	@Get('byTitle/:title')
	async getByTitle(@Param('title') title: string) {
		return await this.colorService.getByTitle(title);
	}

	@Get()
	async getAll(@Query('page') page: string, @Query('limit') limit: string) {
		const pageNumber = Number(page);
		const limitNumber = Number(limit);
		if (isNaN(pageNumber) || isNaN(limitNumber)) {
			throw new HttpException(ColorErrors.INVALID_PARAMS, HttpStatus.BAD_REQUEST);
		}
		return await this.colorService.getAll(pageNumber, limitNumber);
	}
}
