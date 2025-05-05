import { HttpException, HttpStatus } from '@nestjs/common'

export class DuplicateEntryException extends HttpException {
	constructor(err: any) {
		super(
			{ error: `duplicate ${Object.keys(err.keyPattern)}` },
			HttpStatus.FORBIDDEN
		)
	}
}
