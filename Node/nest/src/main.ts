import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrintterMiddleware } from './printer/printer.middleware';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 自定义全局中间件
  app.use(PrintterMiddleware);

  // 跨域请求
  app.use(cors());

  await app.listen(3000);

  console.log(`listen: http://localhost:3000/`);
}
bootstrap();
