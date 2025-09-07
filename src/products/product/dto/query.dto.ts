import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class QueryDto {
	@IsOptional()
	@IsString()
	search?: string

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
