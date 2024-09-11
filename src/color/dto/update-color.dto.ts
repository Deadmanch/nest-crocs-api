import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ColorErrors } from '../color.constants';
import { Transform } from 'class-transformer';

export class UpdateColorDto {
	@IsOptional()
	@IsString({ message: ColorErrors.TITLE_MUST_BE_STRING })
	title?: string;

	@IsOptional()
	@IsBoolean({ message: ColorErrors.IN_STOCK_MUST_BE_BOOLEAN })
	@Transform(({ value }) => value === 'true' || value === true)
	inStock?: boolean;

	@IsOptional()
	@IsArray({ message: ColorErrors.IMAGES_MUST_BE_ARRAY_STRING })
	@IsString({ each: true, message: ColorErrors.IMAGES_MUST_BE_ARRAY_STRING })
	images?: string[];
}
