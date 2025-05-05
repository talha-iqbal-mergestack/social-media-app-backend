import { Controller, Request, Post, Get, UseGuards, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/localAuth.guard'
import { AuthService } from './auth/auth.service'
import { Public } from './decorators'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService
	) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('users/login')
	login(@Request() req: any) {
		return this.authService.login(req.user)
	}

	// @Get()
	// getHello(): string {
	// 	return this.appService.getHello()
	// }
}
