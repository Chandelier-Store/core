import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class QueryDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	category?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	offset?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number
}
