import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  index() {

    return this.userService.findAll();

  }

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) userId: number,
  ) {

    return this.userService.findOne(userId);

  }

  @Post()
  async create(
    @Body() data,
  ) {

    return this.userService.create(data);

  }

  @Patch(':id')
  updatePartial() {
    return `Update Patch`;
  }

  @Put(':id')
  update() {
    return `Update Put`;
  }

  @Delete(':id')
  delete() {
    return `Delete`;
  }
}
