import { Test, TestingModule } from '@nestjs/testing';
import { JestTestsController } from './jest-tests.controller';
import { JestTestsService } from './jest-tests.service';

describe('JestTestsController', () => {
  let controller: JestTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JestTestsController],
      providers: [JestTestsService],
    }).compile();

    controller = module.get<JestTestsController>(JestTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
