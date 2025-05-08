import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, QueryOptions } from 'mongoose'
import { User } from './user.schema'
import { ErrorHandler } from '../error-handling/error.handler'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>
	) {}

	async createUser({ createUserDto }) {
		try {
			const createdUser = new this.userModel(createUserDto)
			return await createdUser.save()
		} catch (err) {
			new ErrorHandler(err)
		}
	}

	async getAllUsers({ page, limit }) {
		const users = await this.userModel
			.find()
			.limit(limit)
			.skip((page - 1) * limit)

		return users
	}

	async updateUser({ id, updateUserDto }) {
		const user = await this.userModel.findOne({ _id: id })
		if (!user) throw new NotFoundException('User not found')

		user.set(updateUserDto)
		return await user.save()
	}

	async deleteUser({ id }) {
		const deletedUser = await this.userModel.findByIdAndDelete(id)

		if (!deletedUser) throw new NotFoundException('User not found')

		return deletedUser
	}

	async findUserByEmail({ email, returnPassword = false }) {
		let user = null
		if (returnPassword) {
			user = await this.userModel.findOne({ email }).select('+password')
		} else {
			user = await this.userModel.findOne({ email })
		}
		if (!user) throw new NotFoundException('User with this email not found')

		return user
	}

	async findUserByCode(code: number) {
		const user = await this.userModel.findOne({
			$or: [{ signup_otp: code }, { reset_password_otp: code }],
		})
		if (!user) throw new NotFoundException('Invalid OTP')

		return user
	}

	async findUserById(userId: string) {
		const user = await this.userModel.findById(userId)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user
	}

	async addLikedPostToUser({
		postId,
		userId,
		// session
	}) {
		const conditions = { _id: userId }
		const update = {
			$addToSet: { liked_posts: postId },
		}
		const options: QueryOptions = {
			new: true,
			// session
		}
		const updatedUser = await this.userModel.findByIdAndUpdate(
			conditions,
			update,
			options
		)
		if (!updatedUser) {
			throw new NotFoundException(
				`User with ID ${userId} not found for liking post.`
			)
		}

		return updatedUser
	}

	async followUser({ followerId, followingId }) {
		if (followerId === followingId) {
			throw new BadRequestException('Users cannot follow themselves')
		}

		const [follower, following] = await Promise.all([
			this.userModel.findById(followerId),
			this.userModel.findById(followingId),
		])

		if (!follower || !following) {
			throw new NotFoundException('User not found')
		}

		// const session = await this.userModel.db.startSession()
		try {
			// session.startTransaction()

			await Promise.all([
				this.userModel.findByIdAndUpdate(
					followerId,
					{ $addToSet: { following: followingId } }
					// { session }
				),
				this.userModel.findByIdAndUpdate(
					followingId,
					{ $addToSet: { followers: followerId } }
					// { session }
				),
			])

			// await session.commitTransaction()
			return { success: true }
		} catch (error) {
			// await session.abortTransaction()
			throw error
		} finally {
			// session.endSession()
		}
	}

	async unfollowUser({ followerId, followingId }) {
		if (followerId === followingId) {
			throw new BadRequestException('Invalid operation')
		}

		// const session = await this.userModel.db.startSession()
		try {
			// session.startTransaction()

			await Promise.all([
				this.userModel.findByIdAndUpdate(
					followerId,
					{ $pull: { following: followingId } }
					// { session }
				),
				this.userModel.findByIdAndUpdate(
					followingId,
					{ $pull: { followers: followerId } }
					// { session }
				),
			])

			// await session.commitTransaction()
			return { success: true }
		} catch (error) {
			// await session.abortTransaction()
			throw error
		} finally {
			// session.endSession()
		}
	}

	async getFollowersAndFollowing({ userId }) {
		const user = await this.userModel
			.findById(userId)
			.populate('followers', 'name email')
			.populate('following', 'name email')

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return {
			followers: user.followers,
			following: user.following,
		}
	}
}
