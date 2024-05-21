import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Deploy no GitLab CI/CD!!!';
  }
}
