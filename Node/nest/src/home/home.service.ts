import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dog } from './entities/home.entity';

@Injectable()
export class HomeService {
  constructor(@InjectRepository(Dog) private readonly dog: Repository<Dog>) {}

  async getDogs(): Promise<any> {
    const res = await this.dog.find();

    return {
      code: 0,
      data: res,
      msg: 'success',
    };
  }

  // 模糊查询
  async getDogByName(name: string) {
    const res = await this.dog.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    return {
      code: 0,
      data: res,
      msg: 'success',
    };
  }

  getDogByid(id: number): any {
    let neme = '';
    switch (id) {
      case 1:
        neme = '小黄';
        break;

      default:
        neme = '小黑';
        break;
    }

    return {
      id,
      neme,
    };
  }

  async addDog(params?: any): Promise<any> {
    const myDog = new Dog();
    myDog.name = params.name || '富贵';
    myDog.age = 1;
    myDog.skill = '打豆豆';

    const res = await this.dog.save(myDog);

    return {
      code: 0,
      data: res,
      msg: 'success',
    };
  }

  async deleteDog(id: number): Promise<any> {
    const res = await this.dog.delete(id);
    return {
      code: 0,
      data: res,
      msg: 'success',
    };
  }

  async updateDog(id: number) {
    const mayDog = new Dog();
    mayDog.name = '小黑';
    mayDog.age = 2;
    return this.dog.update(id, mayDog);
  }
}
