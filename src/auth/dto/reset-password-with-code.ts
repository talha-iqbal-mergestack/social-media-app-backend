import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator'

export class ResetPasswordWithCodeDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	password: string
}
