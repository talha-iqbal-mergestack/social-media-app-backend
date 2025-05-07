import { InternalServerErrorException } from '@nestjs/common'
import {
	DuplicateEntryException,
	SmtpConnectionException,
} from './custom-exceptions'

export class ErrorHandler {
	constructor(err: any) {
		if (err.code === 11000) {
			throw new DuplicateEntryException(err)
		} else if (err.code === 'ESOCKET') {
			throw new SmtpConnectionException(err)
		} else {
			throw new InternalServerErrorException(err)
		}
	}
}
