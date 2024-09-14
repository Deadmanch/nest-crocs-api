import { IsNumber } from 'class-validator';
import { CartErrors } from '../cart.constants';

export class CreateCartDto {
	@IsNumber({}, { message: CartErrors.PRODUCT_ID_MUST_BE_NUMBER })
	productId: number;
	@IsNumber({}, { message: CartErrors.COLOR_ID_MUST_BE_NUMBER })
	colorId: number;
	@IsNumber({}, { message: CartErrors.SIZE_ID_MUST_BE_NUMBER })
	sizeId: number;
	@IsNumber({}, { message: CartErrors.QUANTITY_MUST_BE_NUMBER })
	quantity: number;
}
