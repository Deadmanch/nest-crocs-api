import { IsNumber, IsOptional } from 'class-validator';
import { CartErrors } from '../cart.constants';

export class UpdateCartDto {
	@IsOptional()
	@IsNumber({}, { message: CartErrors.PRODUCT_ID_MUST_BE_NUMBER })
	quantity?: number;
}
