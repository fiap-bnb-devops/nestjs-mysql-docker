import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return 'List users';
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return `Show user ${id}`;
  }

  @Post()
  async create() {
    return this.prisma.users.create({
      data: {
        name: 'Joao',
        email: 'joao@hcode.com.br',
        password: '123456',
      },
    });
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
