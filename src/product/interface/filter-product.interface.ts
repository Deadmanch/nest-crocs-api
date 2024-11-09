export interface IFilterProduct {
	categoryId?: number;
	minPrice?: number;
	maxPrice?: number;
	colorIds?: number[];
	sizeIds?: number[];
	page?: number;
	limit?: number;
}
