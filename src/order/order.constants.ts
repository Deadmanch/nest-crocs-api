import { PaymentMethod } from '@prisma/client';
export const OrderErrors = {
	USER_ID_MUST_BE_NUMBER: 'User ID must be a number',
	FULL_NAME_MUST_BE_STRING: 'Full name must be a string',
	ZIP_CODE_MUST_BE_STRING: 'Zip code must be a string',
	CITY_MUST_BE_STRING: 'City must be a string',
	STREET_ADDRESS_MUST_BE_STRING: 'Street address must be a string',
	EMAIL_MUST_BE_STRING: 'Email must be a string',
	STATE_MUST_BE_STRING: 'State must be a string',
	PHONE_NUMBER_MUST_BE_STRING: 'Phone number must be a string',
	TOTAL_AMOUNT_MUST_BE_NUMBER: 'Total amount must be a number',
	PAYMENT_METHOD_MUST_BE_STRING: `Payment method must be one of ${Object.values(PaymentMethod)}`,
	PRODUCT_ID_MUST_BE_NUMBER: 'Product ID must be a number',
	QUANTITY_MUST_BE_NUMBER: 'Quantity must be a number',
	SIZE_MUST_BE_STRING: 'Size must be a string',
	COLOR_MUST_BE_STRING: 'Color must be a string',
	NOT_FOUND: 'Order not found',
	PRICE_MUST_BE_NUMBER: 'Price must be a number',
};
