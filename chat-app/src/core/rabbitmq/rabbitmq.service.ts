import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel, Connection, Options, Replies } from 'amqplib';

@Injectable()
export class RabbitMQService {
    private readonly logger = new Logger(RabbitMQService.name);
    private connection: Connection;
    private channel: Channel;
    private readonly url: string;

    constructor() {
        this.url = process.env.RABBITMQ_URL || 'amqp://admin:password123@rabbitmq:5672/';
        this.initialize().catch(err => {
            this.logger.error('RabbitMQ initialization error', err.stack);
        });
    }

    private async initialize() {
        try {
            console.log('Initializing RabbitMQ service...');
            console.log('Connecting to RabbitMQ at', this.url);
            this.connection = await connect(this.url);
            this.channel = await this.connection.createChannel();

            // On utilise la queue pré-définie pour les réponses
            await this.channel.assertExchange('chatapp.exchange', 'direct', { durable: true });

            this.logger.log('RabbitMQ service initialized');
        } catch (error) {
            this.logger.error('Failed to initialize RabbitMQ', error.stack);
            throw error;
        }
    }

    async sendWithReply(queue: string, replyQueue : string, operation : string, data: any, timeoutMs = 10000): Promise<any> {
        const requestId = Math.random().toString() + Date.now().toString();

        return new Promise(async (resolve, reject) => {
            try {
                // Configurer le consommateur pour la réponse
                const consumer = await this.channel.consume(replyQueue, (msg) => {
                    if (msg.requestId === requestId) {
                        clearTimeout(timeout);
                        this.logger.debug(`Received reply for requestId ${requestId}`);
                        this.channel.ack(msg);
                        resolve(JSON.parse(msg.content.toString()));
                    }
                }, { noAck: false });

                // Envoyer le message
                this.channel.sendToQueue(
                    queue,
                    Buffer.from(JSON.stringify(data)),
                    {
                        requestId: requestId,
                        operation: operation,
                        replyQueue: replyQueue,
                        persistent: true
                    }
                );
                this.logger.debug(`Message sent to ${queue} with requestId ${requestId}`);

                // Timeout pour éviter les attentes infinies
                const timeout = setTimeout(() => {
                    this.channel.cancel(consumer.consumerTag);
                    reject(new Error(`RabbitMQ timeout after ${timeoutMs}ms`));
                }, timeoutMs);

            } catch (error) {
                reject(error);
            }
        });
    }

    async send(queue: string, message: any): Promise<void> {
        try {
            this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );
            this.logger.debug(`Message sent to ${queue}`);
        } catch (error) {
            this.logger.error(`Failed to send message to ${queue}`, error.stack);
            throw error;
        }
    }
    /*
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
        */

    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
            this.logger.log('RabbitMQ connection closed');
        } catch (error) {
            this.logger.error('Error closing RabbitMQ connection', error.stack);
        }
    }
}