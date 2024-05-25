import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Config } from '@api/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = Config.PORT;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: https://localhost:${port}/${globalPrefix}`);
}

bootstrap();
