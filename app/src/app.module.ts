import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JestTestsModule } from './jest-tests/jest-tests.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [PrismaModule, UserModule, JestTestsModule, RabbitmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
