import { PaymentMethod } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderErrors } from '../order.constants';

export class CreateOrderDto {
	@IsString({ message: OrderErrors.FULL_NAME_MUST_BE_STRING })
	fullName: string;
	@IsString({ message: OrderErrors.ZIP_CODE_MUST_BE_STRING })
	zipCode: string;
	@IsString({ message: OrderErrors.CITY_MUST_BE_STRING })
	city: string;
	@IsString({ message: OrderErrors.STREET_ADDRESS_MUST_BE_STRING })
	streetAddress: string;
	@IsString({ message: OrderErrors.EMAIL_MUST_BE_STRING })
	email: string;
	@IsString({ message: OrderErrors.STATE_MUST_BE_STRING })
	state: string;
	@IsString({ message: OrderErrors.PHONE_NUMBER_MUST_BE_STRING })
	phoneNumber: string;
	@IsNumber({}, { message: OrderErrors.TOTAL_AMOUNT_MUST_BE_NUMBER })
	totalAmount: number;
	@IsString({ message: OrderErrors.PAYMENT_METHOD_MUST_BE_STRING })
	paymentMethod: PaymentMethod;
	items: OrderItemDto[];
}

export class OrderItemDto {
	@IsNumber({}, { message: OrderErrors.PRODUCT_ID_MUST_BE_NUMBER })
	productId: number;
	@IsOptional()
	@IsString({ message: OrderErrors.SIZE_MUST_BE_STRING })
	size?: string;
	@IsString({ message: OrderErrors.COLOR_MUST_BE_STRING })
	@IsOptional()
	color?: string;
	@IsNumber({}, { message: OrderErrors.QUANTITY_MUST_BE_NUMBER })
	quantity: number;
	@IsNumber({}, { message: OrderErrors.PRICE_MUST_BE_NUMBER })
	price: number;
}
