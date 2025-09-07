import { IsString, MinLength, IsEmail } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

  @MinLength(6, { 
    message: 'Password is too short. Minimum length is 6 characters.' 
  })
  @IsString()
  password: string
}
