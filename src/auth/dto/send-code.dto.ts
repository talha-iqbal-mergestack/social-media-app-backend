import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class SendCodeDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
