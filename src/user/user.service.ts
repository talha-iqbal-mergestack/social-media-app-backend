import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user.schema'
import { ErrorHandler } from '../errorHandling/error.handler'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
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
		const fetchedUsers = await this.userModel
			.find()
			.limit(limit)
			.skip((page - 1) * limit)

		return fetchedUsers
	}

	async updateUser({ id, updateUserDto }) {
		const conditions = {
			_id: id,
		}
		const update = { $set: updateUserDto }
		const options = { new: true }

		const updatedUser = await this.userModel.findOneAndUpdate(
			conditions,
			update,
			options
		)
		if (!updatedUser) throw new NotFoundException()

		return updatedUser
	}

	async deleteUser({ id }) {
		const deletedUser = await this.userModel.findByIdAndDelete(id)

		if (!deletedUser) throw new NotFoundException()

		return deletedUser
	}

	async findUser({ email }) {
		const fetchedUser = await this.userModel
			.findOne({ email })
			.select('+password')

		if (!fetchedUser) throw new NotFoundException()

		return fetchedUser
	}
}
