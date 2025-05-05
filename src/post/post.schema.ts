import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import mongoose from 'mongoose'
import { User } from 'src/user/user.schema'

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
		ref: User.name,
	})
	@IsString()
	@IsNotEmpty()
	_poster: string
}

export const PostSchema = SchemaFactory.createForClass(Post)
