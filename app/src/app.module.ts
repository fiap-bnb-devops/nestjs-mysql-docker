import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JestTestsModule } from './jest-tests/jest-tests.module';

@Module({
  imports: [PrismaModule, UserModule, JestTestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
