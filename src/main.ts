import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: '*',
    allowedHeaders: '*',
    maxAge: 10,
  });
  await app.listen(3132);
}
bootstrap();
