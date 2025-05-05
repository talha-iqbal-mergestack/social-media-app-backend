import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { Role } from '../enums'

@Schema({
	timestamps: true,
	toObject: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			delete ret.password
			return ret
		},
	},
	toJSON: {
		transform: function (doc, ret, options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
			delete ret.password
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
}

export const UserSchema = SchemaFactory.createForClass(User)
