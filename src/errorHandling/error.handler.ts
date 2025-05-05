import { InternalServerErrorException } from '@nestjs/common'
import { DuplicateEntryException } from './customExceptions'

export class ErrorHandler {
	constructor(err: any) {
		if (err.code === 11000) {
			throw new DuplicateEntryException(err)
		} else {
			throw new InternalServerErrorException()
		}
	}
}
