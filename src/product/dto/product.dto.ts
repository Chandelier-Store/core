import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

class ProductVariantDto {
	id?: string

	@IsString()
	size: string

	@Type(() => Number)
	@IsNumber()
	price: number

	@Type(() => Number)
	@IsNumber()
	inStock: number
}

export class ProductDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsOptional()
	@IsString({ each: true })
	image?: string

	@IsOptional()
	categoryId?: string

	@ValidateNested({ each: true })
	@Type(() => ProductVariantDto)
	variants: ProductVariantDto[]
}
