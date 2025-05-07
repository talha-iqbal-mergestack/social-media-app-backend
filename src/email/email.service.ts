import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { ErrorHandler } from 'src/error-handling/error.handler'

@Injectable()
export class EmailService {
	constructor(
		private mailerService: MailerService,
		private configSerivce: ConfigService
	) {}

	async sendSignupConfirmation(email: string, code: number) {
		await this.mailerService.sendMail({
			to: email,
			// from: '"Support Team" <support@example.com>',
			subject: 'Welcome  Confirm your Email',
			template: 'signup-confirmation',
			context: {
				appName: this.configSerivce.get('APP_NAME'),
				code,
			},
		})
	}

	async sendPasswordResetCode(email: string, code: number) {
		try {
			await this.mailerService.sendMail({
				to: email,
				// from: '"Support Team" <support@example.com>',
				subject: 'Password Reset Request',
				template: 'forgot-password',
				context: {
					appName: this.configSerivce.get('APP_NAME'),
					code,
				},
			})
		} catch (err) {
			new ErrorHandler(err)
		}
	}
}
