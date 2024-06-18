import { Injectable } from '@nestjs/common';
import { Channel, Connection, Message, connect } from 'amqplib';

@Injectable()
export class RabbitmqService {

    private connection: Connection;
    private channel: Channel;

    async init() {

        try {

            // this.connection = await connect(process.env.RABBIT_URL);
            this.connection = await connect("amqp://rabbit:rabbit@localhost:5672");
            this.channel = await this.connection.createChannel();

        } catch (e) {

            console.error(e);

        }

    }

    async publishInQueue(queue: string, message: string) {

        try {

            await this.channel.assertQueue(queue);

            return this.channel.sendToQueue(queue, Buffer.from(message));

        } catch (err) {

            console.error(err);

        }

    }

    async consumeQueue(queue: string, callback: (message: Message) => void) {

        try {

            if (!this.channel) {
                await this.init();
            }

            await this.channel.assertQueue(queue);

            // Determina um ouvinte para envios em uma determinada fila, junto com uma função de callback para tratar as informações da mensagem
            await this.channel.consume(queue, (message) => {

                try {
                    // Realiza o que o consumer da fila desejar
                    callback(message);
                } catch (err) {
                    console.error("ERROR: ", err);
                }

                try {

                    // Confirmar que a mensagem foi entregue e removê-la da fila
                    if (this.channel) {
                        this.channel.ack(message);
                    }

                } catch (err) {
                    console.error("ERROR ACK: ", err)
                }

            })

        } catch (err) {
            console.error(err);
        }

    }

}
