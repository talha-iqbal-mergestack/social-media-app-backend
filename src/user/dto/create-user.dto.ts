import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(3, 25)
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(8, 25)
	password: string
}
