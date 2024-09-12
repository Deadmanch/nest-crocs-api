import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ProductErrors } from '../product.constants';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
	@IsOptional()
	@IsString({ message: ProductErrors.TITLE_MUST_BE_STRING })
	title: string;
	@IsOptional()
	@IsString({ message: ProductErrors.SLUG_MUST_BE_STRING })
	slug: string;
	@IsOptional()
	@IsArray({ message: ProductErrors.IMAGES_MUST_BE_ARRAY })
	@IsString({ each: true, message: ProductErrors.IMAGES_MUST_BE_ARRAY })
	images?: string[];
	@IsOptional()
	@IsString({ message: ProductErrors.META_TITLE_MUST_BE_STRING })
	metaTitle?: string;
	@IsOptional()
	@IsString({ message: ProductErrors.META_DESC_MUST_BE_STRING })
	metaDesc?: string;
	@IsOptional()
	@IsString({ message: ProductErrors.SEO_TEXT_MUST_BE_STRING })
	seoText?: string;
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.PRICE_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	price: number;
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.DISCONT_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	discont?: number;
	@IsOptional()
	@IsArray({ message: ProductErrors.TAGS_MUST_BE_ARRAY })
	@IsString({ each: true, message: ProductErrors.TAGS_MUST_BE_ARRAY })
	@Transform(({ value }) => (Array.isArray(value) ? value.map(String) : [String(value)]))
	tags?: string[];
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.CATEGORY_ID_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	categoryId: number;
	@IsOptional()
	@IsArray({ message: ProductErrors.SIZE_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@IsNumber({}, { each: true, message: ProductErrors.SIZE_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
	sizeIds: number[];
	@IsOptional()
	@IsArray({ message: ProductErrors.COLOR_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@IsNumber({}, { each: true, message: ProductErrors.COLOR_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
	colorIds: number[];
}
