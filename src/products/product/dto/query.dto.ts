import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class QueryDto {
	@IsOptional()
	@IsString()
	search?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number

	@IsOptional()
	@IsString()
	category?: string
}
