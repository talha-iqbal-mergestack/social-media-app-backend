import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostService } from './post.service'
import { PostController } from './post.controller'
import { Post, PostSchema } from './post.schema'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		UserModule,
	],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
