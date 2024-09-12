export interface IFilterData {
	sizes: { id: number; title: string; inStock: boolean }[];
	colors: { id: number; title: string; inStock: boolean; images: string[] }[];
	maxPrice: number;
	minPrice: number;
}
