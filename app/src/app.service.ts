import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá, seja bem-vindo à nossa API NestJS com Prisma e MySQL - Versão 1.0';
  }
}
