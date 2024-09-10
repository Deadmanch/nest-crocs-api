import { IsOptional, IsString } from 'class-validator';
import { CategoryErrors } from '../category.constants';

export class CreateCategoryDto {
	@IsString({ message: CategoryErrors.NAME_MUST_BE_STRING })
	name: string;
	@IsString({ message: CategoryErrors.TITLE_MUST_BE_STRING })
	title: string;
	@IsString({ message: CategoryErrors.SLUG_MUST_BE_STRING })
	slug: string;
	@IsString({ message: CategoryErrors.META_TITLE_MUST_BE_STRING })
	metaTitle: string;
	@IsString({ message: CategoryErrors.META_DESC_MUST_BE_STRING })
	metaDesc: string;
	@IsString({ message: CategoryErrors.SEO_TEXT_MUST_BE_STRING })
	@IsOptional()
	seoTextRight: string;
	@IsString({ message: CategoryErrors.SEO_TEXT_MUST_BE_STRING })
	@IsOptional()
	seoTextLeft: string;
}
