import {
	Body,
	Controller,
	Param,
	ParseIntPipe,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { Public } from 'src/decorators'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'
import { LoginUserDto, SendCodeDto, ResetPasswordWithCodeDto } from './dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	login(@Request() req: any, @Body() body: LoginUserDto) {
		return this.authService.login(req.user)
	}

	@Public()
	@Post('send-signup-confirmation-code')
	async sendSignupConfirmationCode(@Body() body: SendCodeDto) {
		return await this.authService.sendSignupConfirmationCode(body.email)
	}

	@Public()
	@Post('confirm-signup-with-code/:code')
	async confirmSignupWithCode(@Param('code', ParseIntPipe) code: number) {
		return await this.authService.confirmSignupWithCode(code)
	}

	@Public()
	@Post('send-password-reset-code')
	async sendPasswordResetCode(@Body() body: SendCodeDto) {
		return await this.authService.sendPasswordResetCode(body.email)
	}

	@Public()
	@Post('reset-password-with-code/:code')
	async resetPasswordWithCode(
		@Param('code', ParseIntPipe) code: number,
		@Body() body: ResetPasswordWithCodeDto
	) {
		return await this.authService.resetPasswordWithCode(code, body.password)
	}
}
