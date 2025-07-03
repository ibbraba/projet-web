import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from "../../../core/rabbitmq/rabbitmq.service";
import { Message } from "../models/message.model";
import { SendMessageInput } from "../dto/send-message.input";


@Injectable()
export class MessagesService {
    private readonly logger = new Logger(MessagesService.name);
    public readonly messageQueue: string = 'message.queue';
    public readonly messageReplyQueue: string = 'message.response';

    constructor(private readonly rabbitMQService: RabbitMQService) { }

    async createMessage(input: SendMessageInput): Promise<Message> {
        try {

            const request = {
                content: input.content,
                senderId: input.senderId,
                conversationId: input.conversationId
            };
            const response = await this.rabbitMQService.sendWithReply(this.messageQueue, this.messageReplyQueue, 'create', request);

            return response;
        } catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`, error.stack);
            throw new Error('Could not send message');
        }
    }

    private async updateMessage(messageId: string, content: string): Promise<void> {
        try {
            const request = {
                content: content,
                messageId: messageId
            };
            const response = await this.rabbitMQService.sendWithReply(this.messageQueue, this.messageReplyQueue, 'update', request);
            return response
        }
        catch (error) {
            this.logger.error(`Failed to publish message: ${error.message}`);
            // Système de retry pourrait être implémenté ici
        }
    }


}