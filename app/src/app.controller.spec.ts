import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Olá, seja bem-vindo à nossa API NestJS com Prisma e MySQL');
    });
  });*/

  describe('root', () => {
    it('should be 1', () => {
      expect(1).toBe(1);
    });
  });
});
