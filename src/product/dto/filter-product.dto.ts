import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ProductErrors } from '../product.constants';
import { Transform } from 'class-transformer';

export class FilterProductDto {
	@IsNumber({}, { message: ProductErrors.CATEGORY_ID_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	categoryId: number;
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.MIN_PRICE_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	minPrice?: number;
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.MAX_PRICE_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	maxPrice?: number;
	@IsOptional()
	@IsArray({ message: ProductErrors.COLOR_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@IsNumber({}, { each: true, message: ProductErrors.COLOR_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
	colorIds?: number[];
	@IsOptional()
	@IsArray({ message: ProductErrors.SIZE_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@IsNumber({}, { each: true, message: ProductErrors.SIZE_IDS_MUST_BE_ARRAY_OF_NUMBERS })
	@Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
	sizeIds?: number[];
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.PAGE_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	page?: number;
	@IsOptional()
	@IsNumber({}, { message: ProductErrors.LIMIT_MUST_BE_NUMBER })
	@Transform(({ value }) => Number(value))
	limit?: number;
}
