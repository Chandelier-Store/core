import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'

class ProductVariantDto {
	id?: string

	@IsString()
	size: string

	@Type(() => Number)
	@IsNumber()
	price: number

	@Type(() => Boolean)
	@IsBoolean()
	inStock: boolean
}

export class ProductDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	slug?: string

	@IsString()
	description: string

	@IsOptional()
	@IsString()
	image?: string

	@IsOptional()
	@IsString()
	categoryId?: string

	@ValidateNested({ each: true })
	@Type(() => ProductVariantDto)
	variants: ProductVariantDto[]
}
