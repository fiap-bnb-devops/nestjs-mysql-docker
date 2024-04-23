import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JestTestsService } from './jest-tests.service';
import { CreateJestTestDto } from './dto/create-jest-test.dto';
import { UpdateJestTestDto } from './dto/update-jest-test.dto';

@Controller('jest-tests')
export class JestTestsController {
  constructor(private readonly jestTestsService: JestTestsService) {}

  @Post()
  create(@Body() createJestTestDto: CreateJestTestDto) {
    return this.jestTestsService.create(createJestTestDto);
  }

  @Get()
  findAll() {
    return this.jestTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jestTestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJestTestDto: UpdateJestTestDto) {
    return this.jestTestsService.update(+id, updateJestTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jestTestsService.remove(+id);
  }
}
