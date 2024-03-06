import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  if (process.env.NODE_ENV !== 'PROD') {
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS', 'HEAD'],
    });
  }
  await app.listen(3000);
}
bootstrap();
