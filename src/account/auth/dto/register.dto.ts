import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

export class RegisterDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password is too short. Minimum length is 6 characters.'
	})
	@IsString()
	password: string

	@IsString()
	name: string

	@IsOptional()
	@IsString()
	@Matches(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number' })
	phone?: string
}
