import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Request,
	Query,
} from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto, UpdatePostDto } from './dto'
import { Public, Roles } from 'src/decorators'
import { Role } from 'src/enums'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import mongoose from 'mongoose'

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
		return this.postService.createPost({
			createPostDto,
			userId: req.user.id,
		})
	}

	@Get()
	@Roles(Role.Admin)
	getAllPosts(@Query() query: PaginationDto) {
		const { page, limit } = query
		return this.postService.getAllPosts({ page, limit })
	}

	@Get('my-posts')
	getPostsByUserId(@Query() query: PaginationDto, @Request() req: any) {
		const { page, limit } = query
		return this.postService.getPostsByUserId({
			userId: req.user.id,
			page,
			limit,
		})
	}

	@Get('feed')
	getPostsFeed(@Request() req: any, @Query() query: PaginationDto) {
		const { page, limit } = query
		return this.postService.getPostsFeed({
			userId: req.user.id,
			page,
			limit,
		})
	}

	@Get('feed/following')
	getFollowingPosts(@Request() req: any, @Query() query: PaginationDto) {
		const { page, limit } = query
		return this.postService.getFollowingPosts({
			userId: req.user.id,
			page,
			limit,
		})
	}

	@Get('feed/following-likes')
	getFollowingLikedPosts(@Request() req: any, @Query() query: PaginationDto) {
		const { page, limit } = query
		return this.postService.getFollowingLikedPosts({
			userId: req.user.id,
			page,
			limit,
		})
	}

	@Get(':id')
	getPostById(@Param('id') id: mongoose.Schema.Types.ObjectId) {
		return this.postService.getPostById({ id })
	}

	@Patch(':id')
	updatePostById(
		@Param('id') id: mongoose.Schema.Types.ObjectId,
		@Body() updatePostDto: UpdatePostDto,
		@Request() req: any
	) {
		return this.postService.updatePostById({
			postId: id,
			updatePostDto,
			userId: req.user.id,
		})
	}

	@Delete(':id')
	deletePost(@Param('id') id: mongoose.Schema.Types.ObjectId) {
		return this.postService.deletePost({ id })
	}

	@Post(':id/like')
	likePost(
		@Param('id') id: mongoose.Schema.Types.ObjectId,
		@Request() req: any
	) {
		return this.postService.likePost({ postId: id, userId: req.user.id })
	}
}
