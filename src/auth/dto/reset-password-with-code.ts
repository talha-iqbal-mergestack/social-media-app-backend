import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordWithCodeDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	password: string
}
