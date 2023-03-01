import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from './entities/home.entity';
import { CounterMiddleware } from '../counter/counter.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Dog])],
  controllers: [HomeController],
  providers: [HomeService],
})
// 自定义局部中间件
export class HomeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CounterMiddleware).forRoutes('home');
  }
}
