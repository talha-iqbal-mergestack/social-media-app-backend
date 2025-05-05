import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import mongoose from 'mongoose'
import { PaginationDto } from '../common/dto/pagination.dto'
import { CreateProductDto, UpdateProductDto } from './dto'
import { ProductService } from './product.service'
import { Role } from '../enums'
import { Public, Roles } from '../decorators'
import { JwtAuthGuard } from '../auth/jwtAuth.guard'

@Controller('products')
export class ProductController {
	constructor(private readonly service: ProductService) {}

	@Public()
	@Post()
	createProduct(@Body() body: CreateProductDto) {
		return this.service.createProduct({ createProductDto: body })
	}

	@Get()
	@Roles(Role.Admin)
	getAllProducts(@Query() query: PaginationDto) {
		const { page, limit } = query
		return this.service.getAllProducts({ page, limit })
	}

	@Patch(':id')
	updateProduct(
		@Param('id') id: mongoose.Schema.Types.ObjectId,
		@Body() body: UpdateProductDto
	) {
		return this.service.updateProduct({ id, updateProductDto: body })
	}

	@Delete(':id')
	deleteProduct(@Param('id') id: mongoose.Schema.Types.ObjectId) {
		return this.service.deleteProduct({ id })
	}
}
