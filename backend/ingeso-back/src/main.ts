// Polyfill for crypto.randomUUID if not available
if (!globalThis.crypto) {
  const crypto = require('crypto');
  globalThis.crypto = crypto;
} else if (!globalThis.crypto.randomUUID) {
  const crypto = require('crypto');
  globalThis.crypto.randomUUID = crypto.randomUUID;
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
    transform: true, // Transform payloads to be objects typed according to their DTO classes
    disableErrorMessages: false, // Keep error messages in production
  }));
  
  // Enable CORS to allow requests from any origin
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
    // Set global prefix for all routes to be under /api
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
