import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
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
}
