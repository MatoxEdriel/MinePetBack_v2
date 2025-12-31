import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;

  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';

  app.enableCors({

    origin: corsOrigin,
    credentials: true

  });

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
  )
  await app.listen(port);
}
bootstrap();
