import {
	Controller,
	Body,
	Post,
	Get,
	Patch,
	Delete,
	Query,
	Param,
} from '@nestjs/common'
import mongoose from 'mongoose'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UserService } from './user.service'
import { Roles } from '../decorators'
import { Role } from '../enums'

@Controller('users')
export class UserController {
	constructor(private readonly service: UserService) {}

	@Post()
	createUser(@Body() body: CreateUserDto) {
		return this.service.createUser({ createUserDto: body })
	}

	@Get()
	@Roles(Role.Admin)
	getAllUsers(@Query() query: PaginationDto) {
		const { page, limit } = query
		return this.service.getAllUsers({ page, limit })
	}

	@Patch(':id')
	updateUser(
		@Param('id') id: mongoose.Schema.Types.ObjectId,
		@Body() body: UpdateUserDto
	) {
		return this.service.updateUser({ id, updateUserDto: body })
	}

	@Delete(':id')
	deleteUser(@Param('id') id: mongoose.Schema.Types.ObjectId) {
		return this.service.deleteUser({ id })
	}
}
