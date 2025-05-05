import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsNotEmpty, Length } from 'class-validator'

@Schema({
	timestamps: true,
	toObject: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			return ret
		},
	},
	toJSON: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			return ret
		},
	},
})
export class Product {
	@Prop({ unique: true })
	@IsNotEmpty()
	@Length(3, 25)
	name: string

	@Prop()
	@IsNotEmpty()
	@Length(3, 25)
	brand: string

	@Prop()
	@IsNotEmpty()
	price: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
