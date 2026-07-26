import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // --- Swagger Setup ---
  const config = new DocumentBuilder()
    .setTitle('PulseBook API')
    .setDescription('Medical Appointment & Schedule Management System API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // Key used in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Path will be: http://localhost:3000/docs
  // ----------------------



  // 1. Set global prefix
  app.setGlobalPrefix('api');

  // 2. Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 3. Global Response Interceptor (Laravel JsonResource equivalent)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Global Exception Filter (Laravel Handler equivalent)
  app.useGlobalFilters(new HttpExceptionFilter())


  await app.listen(8000);
}
bootstrap();