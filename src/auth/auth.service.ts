import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async validateUser(email: string, pass: string) {
		const user = await this.userService.findUser({ email })
		const hash = user.password
		const isMatch = await bcrypt.compare(pass, hash)

		if (!isMatch) {
			return null
		}

		return user
	}

	async login(user: any) {
		const payload = { email: user.email, sub: user.id, roles: user.roles }
		return {
			access_token: this.jwtService.sign(payload),
		}
	}
}
