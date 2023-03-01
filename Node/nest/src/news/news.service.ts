import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {
  getHello(): string {
    return 'Hello World!';
  }

  getDog(): any {
    return {
      code: 0,
      data: ['小黄', '小黑'],
      msg: '',
    };
  }
}
