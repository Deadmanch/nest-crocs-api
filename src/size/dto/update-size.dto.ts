import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SizeErrors } from '../size.constants';

export class UpdateSizeDto {
	@IsOptional()
	@IsString({ message: SizeErrors.TITLE_MUST_BE_STRING })
	title: string;

	@IsOptional()
	@IsBoolean({ message: SizeErrors.IN_STOCK_MUST_BE_BOOLEAN })
	@Transform(({ value }) => value === 'true' || value === true)
	inStock: boolean;
}
