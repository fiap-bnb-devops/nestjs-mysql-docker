import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [RabbitmqModule],
  controllers: [AppController],
  providers: [
    AppService,
    RabbitmqService,
  ],
})
export class AppModule {

  constructor(
    private readonly rabbitmqService: RabbitmqService,
  ) {

    this.useRabbitmq();

  }

  async useRabbitmq() {

    await this.rabbitmqService.init();

    await this.rabbitmqService.consumeQueue('create-user', async (message) => {

      console.log("CRIANDO O USUARIO NO APP 2");

    });

  }

}
