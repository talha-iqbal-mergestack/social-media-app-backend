import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'

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
	providers: [AuthService, LocalStrategy, ConfigService, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
