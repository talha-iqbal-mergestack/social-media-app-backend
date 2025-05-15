import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { EmailService } from 'src/email/email.service'

const jwtFactory = {
	useFactory: async (configService: ConfigService) => ({
		secret: configService.get('JWT_SECRET'),
		signOptions: {
			expiresIn: configService.get('JWT_EXPIRY_DURATION'),
		},
	}),
	inject: [ConfigService],
}

@Module({
	imports: [UserModule, PassportModule, JwtModule.registerAsync(jwtFactory)],
	providers: [
		AuthService,
		LocalStrategy,
		ConfigService,
		JwtStrategy,
		EmailService,
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
