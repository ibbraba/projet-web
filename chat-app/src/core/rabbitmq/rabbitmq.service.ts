// src/rabbitmq/rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService {
    private connection: Connection;
    private channel: Channel;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.connection = await connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
    }

    async sendMessage(queue: string, message: any) {
        await this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async receiveMessage(queue: string): Promise<any> {
        await this.channel.assertQueue(queue);
        return new Promise((resolve) => {
            this.channel.consume(queue, (msg) => {
                if (msg) {
                    const content = JSON.parse(msg.content.toString());
                    this.channel.ack(msg);
                    resolve(content);
                }
            });
        });
    }
}