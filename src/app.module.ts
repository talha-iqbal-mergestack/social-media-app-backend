import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AllExceptionsFilter } from './error-handling/all-exception.filter'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { RolesGuard } from './auth/role.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { PostModule } from './post/post.module'
import { EmailModule } from './email/email.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local'],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get('DB_URI'),
			}),
			inject: [ConfigService],
		}),
		UserModule,
		AuthModule,
		PostModule,
		EmailModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
