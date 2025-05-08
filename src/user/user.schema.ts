import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator'
import { Role } from '../enums'
import mongoose from 'mongoose'
import { Post } from 'src/post/post.schema'

@Schema({
	timestamps: true,
	toObject: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			delete ret.password
			delete ret.signup_otp
			delete ret.signup_otp_expiry
			delete ret.reset_password_otp
			delete ret.reset_password_otp_expiry
			return ret
		},
	},
	toJSON: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			delete ret.password
			delete ret.signup_otp
			delete ret.signup_otp_expiry
			delete ret.reset_password_otp
			delete ret.reset_password_otp_expiry
			return ret
		},
	},
})
export class User {
	@Prop()
	@IsNotEmpty()
	@Length(3, 25)
	name: string

	@Prop({ unique: true })
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Prop()
	@IsNotEmpty()
	@Length(3, 25)
	password: string

	@Prop({
		default: [Role.User],
		type: Array,
		lowercase: true,
		enum: Role,
	})
	@IsNotEmpty()
	roles: Role[]

	@Prop()
	@IsOptional()
	@IsNumber()
	reset_password_otp: number

	@Prop()
	@IsOptional()
	@IsString()
	reset_password_otp_expiry: Date

	@Prop()
	@IsOptional()
	@IsNumber()
	signup_otp: number

	@Prop()
	@IsOptional()
	@IsNumber()
	signup_otp_expiry: number

	@Prop({ default: false })
	@IsOptional()
	@IsBoolean()
	is_email_verified: boolean

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: User.name,
			},
		],
		default: [],
	})
	followers: mongoose.Schema.Types.ObjectId[]

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: User.name,
			},
		],
		default: [],
	})
	following: mongoose.Schema.Types.ObjectId[]

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: Post.name,
			},
		],
		default: [],
	})
	liked_posts: mongoose.Schema.Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
