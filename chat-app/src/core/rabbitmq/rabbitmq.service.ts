import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel, Connection, Options, Replies } from 'amqplib';
import { Console } from 'console';
import { uid } from 'uid';

@Injectable()
export class RabbitMQService {
    private readonly logger = new Logger(RabbitMQService.name);
    private connection: Connection;
    private channel: Channel;
    private readonly url: string;

    constructor() {
        //TODO change to rabbutMQ URL from env variable
        this.url = process.env.RABBITMQ_URL || 'amqp://admin:password123@localhost:5672/';
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


    async sendWithReply(
        queue: string,
        replyQueue: string,
        operation: string,
        data: any,
        timeoutMs = 10000
    ): Promise<any> {
        const requestId = uid(); // Generate requestId ONCE
        let timeout: NodeJS.Timeout; // Define timeout in outer scope
        let consumerTag: string;     // So we can cancel if needed

        return new Promise(async (resolve, reject) => {
            try {
                consumerTag = (
                    await this.channel.consume(
                        replyQueue,
                        (msg) => {
                            try {
                                const raw = msg.content.toString();
                                const message = JSON.parse(raw);
                                const msgRequestId = message.requestId;
                                console.log('🔵 raw message:', raw);
                                console.log('🟢 Received msg with requestId:', msgRequestId);
                                console.log('🟡 Expected requestId:', requestId);

                                if (msgRequestId === requestId) {
                                    clearTimeout(timeout);
                                    this.channel.ack(msg);
                                    this.logger.debug(`✅ Matched requestId ${requestId}`);
                                    this.channel.cancel(consumerTag); // Cancel consumer
                                    if (message.data.error) {
                                        this.logger.error(`Error in response: ${message.error}`);
                                        return reject(new Error(message.data.error));
                                    }
                                    resolve(message.data); // Return only the data

                                } else {
                                    this.logger.debug(`❌ Mismatched requestId: ${msgRequestId}`);
                                    this.channel.nack(msg, false, false); // Discard
                                }
                            } catch (err) {
                                this.logger.error(`Error parsing message`, err);
                                this.channel.nack(msg, false, false);
                            }
                        },
                        { noAck: false }
                    )
                ).consumerTag;

                // Send the request message
                this.channel.sendToQueue(
                    queue,
                    Buffer.from(
                        JSON.stringify({
                            requestId,
                            operation,
                            data,
                            replyQueue,
                        })
                    ),
                    {
                        persistent: true,
                    }
                );

                this.logger.debug(`📤 Sent message with requestId ${requestId}`);

                // Setup timeout
                timeout = setTimeout(() => {
                    this.channel.cancel(consumerTag);
                    reject(new Error(`⏰ Timeout waiting for response to requestId ${requestId}`));
                }, timeoutMs);
            } catch (error) {
                if (consumerTag) this.channel.cancel(consumerTag);
                reject(error);
            }
        });
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