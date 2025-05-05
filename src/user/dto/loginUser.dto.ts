import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './createUser.dto'

export class LoginUserDto extends OmitType(CreateUserDto, ['name'] as const) {}
