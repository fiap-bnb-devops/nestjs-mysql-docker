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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    @Body() data: CreateUserDto,
  ) {

    return this.userService.create(data);

  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateData: UpdateUserDto,
  ) {

    return this.userService.update(userId, updateData);

  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ) {

    return this.userService.delete(id);

  }
}
