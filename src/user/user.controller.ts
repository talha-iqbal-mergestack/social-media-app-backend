import {
	Controller,
	Body,
	Post,
	Get,
	Patch,
	Delete,
	Query,
	Param,
	Request,
} from '@nestjs/common'
import mongoose from 'mongoose'

import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UserService } from './user.service'
import { Public, Roles } from 'src/decorators'
import { Role } from 'src/enums'

@Controller('users')
export class UserController {
	constructor(private readonly service: UserService) {}

	@Public()
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

	@Post(':id/follow')
	followUser(
		@Param('id') followingId: mongoose.Schema.Types.ObjectId,
		@Request() req: any
	) {
		return this.service.followUser({
			followerId: req.user.id,
			followingId,
		})
	}

	@Delete(':id/follow')
	unfollowUser(
		@Param('id') followingId: mongoose.Schema.Types.ObjectId,
		@Request() req: any
	) {
		return this.service.unfollowUser({
			followerId: req.user.id,
			followingId,
		})
	}

	@Get(':id/follow-suggestions')
	@Get('follow-suggestions')
	async getUnfollowedUsers(
		@Request() req: any,
		@Query() query: PaginationDto
	) {
		const { page, limit } = query
		return this.service.getUnfollowedUsers({
			userId: req.user.id,
			page,
			limit,
		})
	}

	@Get(':id/followers-and-following')
	async getFollowersAndFollowing(@Param('id') id: string) {
		return this.service.getFollowersAndFollowing({ userId: id })
	}
}
