import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(
	OmitType(CreateUserDto, ['password'] as const)
) {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	reset_password_otp: number

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	reset_password_otp_expiry: Date

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	signup_otp: number

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	signup_otp_expiry: Date

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	is_email_verified: boolean
}
