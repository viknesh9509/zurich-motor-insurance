import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // // Enable global validation pipe
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }));

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-user-role',
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the product service')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-user-role', in: 'header', description: 'Role of the user (e.g., admin)' },
      'userRole' 
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
}

bootstrap();
