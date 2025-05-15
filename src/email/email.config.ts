import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

export const emailConfigurations = MailerModule.forRootAsync({
	useFactory: async (configService: ConfigService) => {
		return {
			transport: {
				host: configService.get('EMAIL_HOST'),
				port: +configService.get('EMAIL_PORT'),
				secure: configService.get('EMAIL_PORT') === '465', // Common for port 465 (SSL)
				auth: {
					user: configService.get('EMAIL_USER'),
					pass: configService.get('EMAIL_PASS'),
				},
			},
			defaults: {
				from: `"${configService.get('APP_NAME') || 'No Reply'}" <${configService.get('EMAIL_FROM_ADDRESS') || 'noreply@example.com'}>`,
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}
	},
	inject: [ConfigService],
})
