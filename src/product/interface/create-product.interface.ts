export interface ICreateProduct {
	title: string;
	slug: string;
	images: string[];
	metaTitle?: string;
	metaDesc?: string;
	seoText?: string;
	originalPrice: number;
	discountedPrice?: number;
	tags?: string[];
	categoryId: number;
	sizeIds: number[];
	colorIds: number[];
}
