import { PartialType } from '@nestjs/swagger';
import { CreateJestTestDto } from './create-jest-test.dto';

export class UpdateJestTestDto extends PartialType(CreateJestTestDto) {}
