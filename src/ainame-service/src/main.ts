import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dySDK } from '@open-dy/node-server-sdk';
import { Cors } from './lib/cors';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  new Cors(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
