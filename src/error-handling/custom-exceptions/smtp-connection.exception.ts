import { HttpException, HttpStatus } from '@nestjs/common'

export class SmtpConnectionException extends HttpException {
	constructor(originalError?: any) {
		super(
			{
				message:
					'Failed to connect to the email server. Please try again later or contact support if the issue persists.',
				error: 'SmtpConnectionError',
				statusCode: HttpStatus.SERVICE_UNAVAILABLE, // 503 Service Unavailable is appropriate
				// You can optionally include details from the original error for logging or debugging
				// originalMessage: originalError?.message
			},
			HttpStatus.SERVICE_UNAVAILABLE
		)
	}
}
