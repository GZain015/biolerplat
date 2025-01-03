import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/module/app.module';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config(); 

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', 
    methods: '*', 
    allowedHeaders: '*', 
  });
  
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
