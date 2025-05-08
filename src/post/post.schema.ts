import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator'
import mongoose from 'mongoose'

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
export class Post {
	@Prop()
	@IsNotEmpty()
	@IsString()
	@Length(3, 25)
	text: string

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	_poster: string

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		default: [],
	})
	@IsOptional()
	@IsArray()
	likes: mongoose.Schema.Types.ObjectId[]
}

export const PostSchema = SchemaFactory.createForClass(Post)
