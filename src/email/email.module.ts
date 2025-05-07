import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { emailConfigurations } from './email.config'
import { ConfigService } from '@nestjs/config'

@Module({
	imports: [emailConfigurations],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
