import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
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
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@Max(1)
	discount?: number = 0

	@IsOptional()
	@IsString()
	categoryId?: string

	@ValidateNested({ each: true })
	@Type(() => ProductVariantDto)
	variants: ProductVariantDto[]
}
