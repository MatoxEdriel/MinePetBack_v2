import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { AllExceptionsFilter } from './core/filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');


  const config = new DocumentBuilder()
    .setTitle('TechFix Api')
    .setDescription('Documentacion de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;

  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document)

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

  //con esto hacemos que las respuesta que envio tengan un formato 



  app.useGlobalInterceptors(new TransformInterceptor())

  app.useGlobalFilters(new AllExceptionsFilter())


  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api');
  });


  await app.listen(port);

  SwaggerModule.setup('api', app, document)
  //dirigir automaticamente


  console.log(`Server up by ${port}`)

}
bootstrap();
