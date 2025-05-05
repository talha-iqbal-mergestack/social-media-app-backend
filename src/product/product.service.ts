import {
	Injectable,
	NotFoundException,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ErrorHandler } from 'src/errorHandling/error.handler'
import { Product } from './product.schema'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<Product>
	) {}

	async createProduct({ createProductDto }) {
		try {
			const createdProduct = new this.productModel(createProductDto)

			return await createdProduct.save()
		} catch (err) {
			new ErrorHandler(err)
		}
	}

	async getAllProducts({ page, limit }) {
		const fetchedProducts = await this.productModel
			.find()
			.limit(limit)
			.skip((page - 1) * limit)

		return fetchedProducts
	}

	async updateProduct({ id, updateProductDto }) {
		const conditions = {
			_id: id,
		}
		const update = { $set: updateProductDto }
		const options = { new: true }

		const updatedProduct = await this.productModel.findOneAndUpdate(
			conditions,
			update,
			options
		)
		if (!updatedProduct) throw new NotFoundException()

		return updatedProduct
	}

	async deleteProduct({ id }) {
		const deletedProduct = await this.productModel.findByIdAndDelete(id)

		if (!deletedProduct) throw new NotFoundException()

		return deletedProduct
	}
}
