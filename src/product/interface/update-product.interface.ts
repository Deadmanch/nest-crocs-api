export interface IUpdateProduct {
	title?: string;
	slug?: string;
	images?: string[];
	metaTitle?: string;
	metaDesc?: string;
	seoText?: string;
	price?: number;
	discont?: number;
	tags?: string[];
	categoryId?: number;
	sizeIds?: number[];
	colorIds?: number[];
}
