import { IsBoolean, IsString } from 'class-validator';
import { SizeErrors } from '../size.constants';
import { Transform } from 'class-transformer';

export class CreateSizeDto {
	@IsString({ message: SizeErrors.TITLE_MUST_BE_STRING })
	title: string;

	@IsBoolean({ message: SizeErrors.IN_STOCK_MUST_BE_BOOLEAN })
	@Transform(({ value }) => value === 'true' || value === true)
	inStock: boolean;
}
