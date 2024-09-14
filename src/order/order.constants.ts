import { PaymentMethod } from '@prisma/client';
export const OrderErrors = {
	USER_ID_MUST_BE_NUMBER: 'ID пользователя должен быть числом.',
	FULL_NAME_MUST_BE_STRING: 'ФИО должно быть строкой.',
	ZIP_CODE_MUST_BE_STRING: 'Индекс должен быть строкой.',
	CITY_MUST_BE_STRING: 'Город должен быть строкой.',
	STREET_ADDRESS_MUST_BE_STRING: 'Адрес должен быть строкой.',
	EMAIL_MUST_BE_STRING: 'Email должен быть строкой.',
	STATE_MUST_BE_STRING: 'Штат должен быть строкой.',
	PHONE_NUMBER_MUST_BE_STRING: 'Номер должен быть строкой.',
	TOTAL_AMOUNT_MUST_BE_NUMBER: 'Сумма должна быть числом.',
	PAYMENT_METHOD_MUST_BE_STRING: `Метод оплаты должен быть - ${PaymentMethod.AFTERPAY} или ${PaymentMethod.CASH_APP_PAY}, или ${PaymentMethod.PAYPAL}, или ${PaymentMethod.CREDIT_CARD}`,
	PRODUCT_ID_MUST_BE_NUMBER: 'ID продукта должен быть числом.',
	QUANTITY_MUST_BE_NUMBER: 'Количество должно быть числом.',
	SIZE_MUST_BE_STRING: 'Размер должен быть строкой.',
	COLOR_MUST_BE_STRING: 'Цвет должен быть строкой.',
	NOT_FOUND: 'Заказ не найден.',
	PRICE_MUST_BE_NUMBER: 'Цена должна быть числом.',
};
