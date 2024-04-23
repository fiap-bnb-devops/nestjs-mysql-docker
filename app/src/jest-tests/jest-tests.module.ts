import { Module } from '@nestjs/common';
import { JestTestsService } from './jest-tests.service';
import { JestTestsController } from './jest-tests.controller';

@Module({
  controllers: [JestTestsController],
  providers: [JestTestsService],
})
export class JestTestsModule {}
