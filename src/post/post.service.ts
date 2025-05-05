import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from './post.schema'
import { Model } from 'mongoose'

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>
	) {}

	async createPost({ createPostDto, userId }) {
		const createdPost = new this.postModel({
			...createPostDto,
			_poster: userId,
		})
		return await createdPost.save()
	}

	async getAllPosts({ page, limit }) {
		const foundPosts = await this.postModel
			.find()
			.limit(limit)
			.skip((page - 1) * limit)
		return foundPosts
	}

	async getPostById({ id }) {
		const foundPost = await this.postModel.findById(id)
		if (!foundPost) throw new NotFoundException()

		return foundPost
	}

	async updatePostById({ postId, updatePostDto, userId }) {
		const conditions = {
			_id: postId,
			_poster: userId,
		}
		const update = updatePostDto
		const options = { new: true }

		const updatedTask = await this.postModel.findOneAndUpdate(
			conditions,
			update,
			options
		)
		if (!updatedTask) {
			throw new NotFoundException()
		}

		return updatedTask
	}

	async deletePost({ id }) {
		const deletedPost = await this.postModel.findByIdAndDelete(id)
		if (!deletedPost) throw new NotFoundException()

		return deletedPost
	}
}
