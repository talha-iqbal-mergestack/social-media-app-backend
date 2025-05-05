import { Controller, Request, Post, Get, UseGuards, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/localAuth.guard'
import { AuthService } from './auth/auth.service'
import { Public } from './decorators'
import { LoginUserDto } from './user/dto/loginUser.dto'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService
	) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('users/login')
	// async login(@Request() req: any) {
	async login(@Body() body: LoginUserDto) {
		// return this.authService.login(req.user)
		return this.authService.login(body)
	}

	// @Get()
	// getHello(): string {
	// 	return this.appService.getHello()
	// }
}
