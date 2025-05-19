/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow requests from any origin
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Set global prefix for all routes to be under /api
  app.setGlobalPrefix('api');
  
  // Habilitar ValidationPipe global para validar automáticamente DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no decoradas
    forbidNonWhitelisted: true, // Rechaza propiedades no decoradas
    transform: true, // Transforma los datos recibidos al tipo esperado
  }));
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
