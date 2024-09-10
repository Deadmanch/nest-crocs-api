import { IsOptional, IsString } from 'class-validator';
import { CategoryErrors } from '../category.constants';

export class UpdateCategoryDto {
	@IsString({ message: CategoryErrors.NAME_MUST_BE_STRING })
	@IsOptional()
	name?: string;
	@IsString({ message: CategoryErrors.TITLE_MUST_BE_STRING })
	@IsOptional()
	title?: string;
	@IsString({ message: CategoryErrors.SLUG_MUST_BE_STRING })
	@IsOptional()
	slug?: string;
	@IsString({ message: CategoryErrors.META_TITLE_MUST_BE_STRING })
	@IsOptional()
	metaTitle?: string;
	@IsString({ message: CategoryErrors.META_DESC_MUST_BE_STRING })
	@IsOptional()
	metaDesc?: string;
	@IsString({ message: CategoryErrors.SEO_TEXT_MUST_BE_STRING })
	@IsOptional()
	seoTextRight: string;
	@IsString({ message: CategoryErrors.SEO_TEXT_MUST_BE_STRING })
	@IsOptional()
	seoTextLeft: string;
}
