import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    RabbitmqService,
    RedisCacheService,
  ],
})
export class UserModule {

  constructor(
    private readonly userService: UserService,
    private readonly rabbitmqService: RabbitmqService,
  ) {

    this.useRabbitmq();

  }

  async useRabbitmq() {

    await this.rabbitmqService.init();

    await this.rabbitmqService.consumeQueue('testing-user', (message) => {
      console.log({
        message,
      })
    });

    await this.rabbitmqService.consumeQueue('create-user', async (message) => {

      console.log("CRIANDO O USUARIO NO APP1")

      /*const data = JSON.parse(String(message.content));

      await this.userService.create(data);*/

    });

  }

}
