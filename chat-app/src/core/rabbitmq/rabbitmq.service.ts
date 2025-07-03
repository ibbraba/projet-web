import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel, Connection, Options, Replies } from 'amqplib';

@Injectable()
export class RabbitMQService {
    private readonly logger = new Logger(RabbitMQService.name);
    private connection: Connection;
    private channel: Channel;
    private readonly url: string;
    private readonly replyQueue = 'amq.rabbitmq.reply-to'; // Queue spéciale pour les réponses

    constructor() {
        this.url = process.env.RABBITMQ_URL || 'amqp://localhost';
        this.initialize().catch(err => {
            this.logger.error('RabbitMQ initialization error', err.stack);
        });
    }

    private async initialize() {
        try {
            this.connection = await connect(this.url);
            this.channel = await this.connection.createChannel();

            // On utilise la queue pré-définie pour les réponses
            await this.channel.assertQueue(this.replyQueue, { exclusive: true });

            this.logger.log('RabbitMQ service initialized');
        } catch (error) {
            this.logger.error('Failed to initialize RabbitMQ', error.stack);
            throw error;
        }
    }

    async sendWithReply(queue: string, message: any, timeoutMs = 10000): Promise<any> {
        const correlationId = Math.random().toString() + Date.now().toString();

        return new Promise(async (resolve, reject) => {
            try {
                // Configurer le consommateur pour la réponse
                const consumer = await this.channel.consume(this.replyQueue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        clearTimeout(timeout);
                        this.channel.ack(msg);
                        resolve(JSON.parse(msg.content.toString()));
                    }
                }, { noAck: false });

                // Envoyer le message
                this.channel.sendToQueue(
                    queue,
                    Buffer.from(JSON.stringify(message)),
                    {
                        correlationId,
                        replyTo: this.replyQueue,
                        persistent: true
                    }
                );

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