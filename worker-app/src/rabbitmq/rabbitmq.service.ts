/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// rabbitmq.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Console } from 'console';
import * as dotenv from 'dotenv';


@Injectable()
export class RabbitMQService implements OnModuleInit {
    public channel: amqp.Channel;
    constructor() { }

    async onModuleInit() {
        dotenv.config();

        console.log("RabbitMQ service called");
        console.log(process.env.RABBITMQ_URL);

        const cnn = await amqp.connect(process.env.RABBITMQ_URL)
        this.channel = await cnn.createChannel()
        // Ensure exchange and queue exist
        await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('test.queue', { durable: true });
        await this.channel.bindQueue('test.queue', 'test.exchange', 'test.created');

        // Publish a message

        await this.publishToExchange('test.exchange', 'test.created', {
            message: Buffer.from('Hello from rabbitmq-wrapper!'),
        });


        console.log('✅ Message published');
        // await this.channel.close();
    }

    getChannel(): amqp.Channel {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not initialized yet.');
        }
        return this.channel;
    }

    async publishToQueue(queueName: string, data: any) {
        this.channel.assertExchange('chatapp.exchange', 'direct', { durable: true });
        this.channel.assertQueue('user.queue');
        this.channel.bindQueue('user.queue', 'chatapp.exchange', 'user.created');
        await this.channel.assertQueue(queueName, { durable: true });

        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            persistent: true,
        });

    }

    async publishToExchange(
        exchangeName: string,
        routingKey: string,
        data: any,) {

        await this.channel.assertExchange(exchangeName, 'direct', { durable: true });

        this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(data)),
            { persistent: true },
        );

        console.log(`📤 Published to exchange [${exchangeName}] with routingKey [${routingKey}]`);
    }

    async consumeQueue(queue: string, handler: (message: any) => Promise<void> | void,)
    {
        await this.channel.assertQueue(queue, { durable: true });

        this.channel.consume(
            queue,
            async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        await handler(content);
                        this.channel.ack(msg);
                    } catch (err) {
                        console.error(`Error handling message in ${queue}`, err);
                        this.channel.nack(msg, false, false); // discard
                    }
                }
            },
            { noAck: false }
        );

        console.log(`Consuming from queue: ${queue}`);
    }
} 