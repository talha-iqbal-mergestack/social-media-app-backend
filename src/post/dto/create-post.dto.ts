import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreatePostDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(3, 550)
	text: string
}
