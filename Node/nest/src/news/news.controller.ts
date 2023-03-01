import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  // private readonly newsService: NewsService => this.newsService = new newsService()
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getHello(): string {
    return this.newsService.getHello();
  }

  @Get('dog')
  getDog(): string {
    return this.newsService.getDog();
  }
}
