import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    // origin: 'http://localhost:3000',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
