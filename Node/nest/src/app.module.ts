import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456', // 123456 | root
      database: 'nest', // 库名
      retryDelay: 500, // 重试链接数据库间隔
      retryAttempts: 10, // 重试链接数据库次数
      synchronize: true, // 是否自动将实体类同步到数据库
      autoLoadEntities: true, // 自动加载实体配置，forFeature()注册的每个实体都自己动加载
    }),
    HomeModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
