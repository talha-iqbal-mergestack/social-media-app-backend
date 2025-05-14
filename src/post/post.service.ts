import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from './post.schema'
import { ClientSession, Model } from 'mongoose'
import { UserService } from 'src/user/user.service'

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post.name)
		private readonly postModel: Model<Post>,
		private readonly userService: UserService
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

	async getPostsByUserId({ userId, page = 1, limit = 10 }) {
		const foundPosts = await this.postModel
			.find({ _poster: userId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip((page - 1) * limit)
			.populate('_poster', 'name email')
			.populate('likes', 'name email')
		return foundPosts
	}

	async getPostById({ id }) {
		const foundPost = await this.postModel.findById(id)
		if (!foundPost) throw new NotFoundException('Post not found')

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

	async likePost({ postId, userId }) {
		// const session = await this.postModel.db.startSession()
		try {
			// session.startTransaction()
			const post = await this.getPostById({ id: postId })

			const [_, updatedPost] = await Promise.all([
				this.userService.addLikedPostToUser({
					postId: post.id,
					userId,
					// session,
				}),
				this.postModel.findByIdAndUpdate(
					{ _id: postId },
					{ $addToSet: { likes: userId } },
					{
						new: true,
						// session
					}
				),
			])
			if (!updatedPost) {
				throw new NotFoundException('Post could not be updated')
			}

			// await session.commitTransaction()
			return { success: true }
		} catch (err) {
			// await session.abortTransaction()
			throw err
		} finally {
			// session.endSession()
		}
	}

	async getFollowingPosts({ userId, page = 1, limit = 10 }) {
		const user = await this.userService.findUserById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		return await this.postModel
			.find({
				_poster: { $in: user.following },
			})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('_poster', 'name email')
			.populate('likes', 'name email')
	}

	async getFollowingLikedPosts({ userId, page = 1, limit = 10 }) {
		const user = await this.userService.findUserById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		return await this.postModel
			.find({
				likes: { $in: user.following },
			})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('_poster', 'name email')
			.populate('likes', 'name email')
	}

	async getPostsFeed({ userId, page = 1, limit = 10 }) {
		const user = await this.userService.findUserById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		return await this.postModel
			.find({
				$or: [
					{ _poster: { $in: user.following } },
					{ likes: { $in: user.following } },
					{ _poster: userId },
				],
			})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('_poster', 'name email')
			.populate('likes', 'name email')
	}
}
