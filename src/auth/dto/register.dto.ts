import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @IsString()
  password: string

  @IsString()
  name: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  role: string
}
