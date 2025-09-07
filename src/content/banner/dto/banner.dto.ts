import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class BannerDto {
  @IsOptional()
  @IsString()
  image?: string

  @IsString()
  link: string

  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isActive: boolean
}
