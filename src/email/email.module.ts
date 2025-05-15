import { Module } from '@nestjs/common'

import { EmailService } from './email.service'
import { emailConfigurations } from './email.config'

@Module({
	imports: [emailConfigurations],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
