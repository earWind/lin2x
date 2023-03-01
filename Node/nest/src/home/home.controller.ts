import {
  Controller,
  Get,
  Post,
  Request,
  Query,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post('/saveLog')
  saveLog(@Request() req): any {
    console.log(req);
    return {
      code: 200,
      msg: 'success',
    };
  }

  @Get('/getDogs')
  getDogs(): any {
    return this.homeService.getDogs();
  }

  @Get('/getDogByid')
  getDogByid(@Request() req): any {
    const id = parseInt(req.query.id);
    return this.homeService.getDogByid(id);
  }

  @Get('/getDogById')
  getDogById(@Query() query): any {
    const id = parseInt(query.id);
    return this.homeService.getDogByid(id);
  }

  @Get('/findDogByName/:name')
  findDogByName(@Param() params): any {
    console.log(params.name);
    const name: string = params.name;
    return this.homeService.getDogByName(name);
  }

  @Get('/deleteDog/:id')
  deleteDog(@Param() params): any {
    const id: number = parseInt(params.id);
    return this.homeService.deleteDog(id);
  }

  @Get('/updateDog/:id')
  updateDog(@Param() params): any {
    const id: number = parseInt(params.id);
    return this.homeService.updateDog(id);
  }

  // 动态路由
  @Get('/findDogById/:id/:name')
  findDogById(@Request() req, @Headers() header): any {
    const id = parseInt(req.params.id);
    const name = req.params.name;

    console.log(header);
    return this.homeService.getDogByid(id + name);
  }

  @Get('/findDogByIdParam/:id/:name')
  findDogByIdParam(@Param() params): any {
    const id = parseInt(params.id);
    const name = params.name;
    return this.homeService.getDogByid(id + name);
  }

  // POST
  @Post('/addDog')
  addDog(): any {
    return this.homeService.addDog();
  }

  @Post('/addDogRequest')
  addDogRequest(@Request() req): any {
    return this.homeService.addDog(req.body);
  }

  @Post('/addDogBody')
  addDogBody(@Body() body): any {
    return this.homeService.addDog(body);
  }
}
