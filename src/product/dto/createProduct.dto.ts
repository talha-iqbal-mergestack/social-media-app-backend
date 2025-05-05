import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(3, 25)
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(3, 25)
	brand: string

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	price: number
}
