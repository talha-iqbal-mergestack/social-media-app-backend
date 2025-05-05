import { IsNumber, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber()
	page?: number = 1

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	limit?: number = 2
}
