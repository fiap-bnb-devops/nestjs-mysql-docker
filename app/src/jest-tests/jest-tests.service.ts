import { Injectable } from '@nestjs/common';
import { CreateJestTestDto } from './dto/create-jest-test.dto';
import { UpdateJestTestDto } from './dto/update-jest-test.dto';

@Injectable()
export class JestTestsService {
  create(createJestTestDto: CreateJestTestDto) {
    return 'This action adds a new jestTest';
  }

  findAll() {
    return `This action returns all jestTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jestTest`;
  }

  update(id: number, updateJestTestDto: UpdateJestTestDto) {
    return `This action updates a #${id} jestTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} jestTest`;
  }
}
