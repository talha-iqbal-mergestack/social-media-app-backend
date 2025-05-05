import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Removes extra values, not supported by DTO
			forbidNonWhitelisted: true, // Throws error when extra values are received
			transformOptions: { enableImplicitConversion: true }, // Transforms values automatically as per DTO
		})
	)

	const config = new DocumentBuilder()
		.setTitle('REST API Nest Demo')
		.setDescription('A REST API implemetation for learning Nest JS')
		.setVersion('1.0')
		.addTag('demo api')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	await app.listen(3000)
}
bootstrap()
