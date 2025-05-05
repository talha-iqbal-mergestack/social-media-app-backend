import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from './user.controller'
import { User, UserSchema } from './user.schema'
import { UserService } from './user.service'
import * as bcrypt from 'bcrypt'

@Module({
	imports: [
		// MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema
					schema.pre('save', function (next) {
						const user = this
						if (!user.isModified('password')) {
							return next()
						}
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(user.password, salt, (err, hash) => {
								user.password = hash
								next()
							})
						})
					})
					return schema
				},
			},
		]),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
