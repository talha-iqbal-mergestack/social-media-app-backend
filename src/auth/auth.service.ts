import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { EmailService } from 'src/email/email.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly emailService: EmailService
	) {}

	async validateUser(email: string, pass: string) {
		const user = await this.userService.findUserByEmail({
			email,
			returnPassword: true,
		})

		const hash = user.password
		const isMatch = await bcrypt.compare(pass, hash)
		if (!isMatch) {
			return null
		}

		return user
	}

	login(user) {
		const payload = { email: user.email, sub: user.id, roles: user.roles }
		return {
			access_token: this.jwtService.sign(payload),
		}
	}

	private randomIntFromInterval(min = 1000, max = 9999) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	async sendSignupConfirmationCode(email: string) {
		const user = await this.userService.findUserByEmail({ email })

		if (user.is_email_verified) {
			throw new BadRequestException('Email already verified')
		}

		const code = this.randomIntFromInterval()
		await this.userService.updateUser({
			id: user.id,
			updateUserDto: {
				signup_otp: code,
				signup_otp_expiry: new Date(Date.now() + 60 * 5 * 1000), // 5 min expiry
			},
		})
		await this.emailService.sendSignupConfirmation(email, code)
		return {
			message: 'Email sent successfully',
		}
	}

	async confirmSignupWithCode(code: number) {
		const user = await this.userService.findUserByCode(code)

		const currentTime = new Date().getTime()
		const otpExpiryTime = new Date(user.signup_otp_expiry).getTime()

		if (user.signup_otp !== code || currentTime > otpExpiryTime) {
			throw new BadRequestException('OTP is invalid or expired')
		} else {
			const updatedUser = await this.userService.updateUser({
				id: user.id,
				updateUserDto: {
					is_email_verified: true,
					signup_otp: null,
					signup_otp_expiry: null,
				},
			})
			return updatedUser
		}
	}

	async sendPasswordResetCode(email: string) {
		const user = await this.userService.findUserByEmail({ email })

		const code = this.randomIntFromInterval()
		await this.userService.updateUser({
			id: user.id,
			updateUserDto: {
				reset_password_otp: code,
				reset_password_otp_expiry: new Date(Date.now() + 60 * 5 * 1000), // 5 min expiry
			},
		})
		await this.emailService.sendPasswordResetCode(email, code)
		return {
			message: 'Email sent successfully',
		}
	}

	async resetPasswordWithCode(code: number, password: string) {
		const user = await this.userService.findUserByCode(code)

		const currentTime = new Date().getTime()
		const otpExpiryTime = new Date(user.reset_password_otp_expiry).getTime()

		if (user.reset_password_otp !== code || currentTime > otpExpiryTime) {
			throw new BadRequestException('OTP is invalid or expired')
		} else {
			const updatedUser = await this.userService.updateUser({
				id: user.id,
				updateUserDto: {
					password,
					reset_password_otp: null,
					reset_password_otp_expiry: null,
				},
			})
			return updatedUser
		}
	}
}
