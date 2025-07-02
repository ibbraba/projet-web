import { Injectable, Logger } from '@nestjs/common';
import {RabbitMQService} from "../../../core/rabbitmq/rabbitmq.service";
import {Message} from "../models/message.models";
import {SendMessageInput} from "../dto/send-message.input";


@Injectable()
export class MessagesService {
    private readonly logger = new Logger(MessagesService.name);

    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async sendMessage(input: SendMessageInput): Promise<Message> {
        try {
            // 1. Envoyer la demande à RabbitMQ
            await this.rabbitMQService.sendMessage('message.send', {
                content: input.content,
                senderId: input.senderId,
                conversationId: input.conversationId
            });

            // 2. Attendre la réponse
            const response = await this.rabbitMQService.receiveMessage(
                `message.send.response.${input.conversationId}`
            );

            // 3. Publier l'événement de création
            await this.publishMessageCreated(response.message);

            return response.message;
        } catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`, error.stack);
            throw new Error('Could not send message');
        }
    }

    private async publishMessageCreated(message: Message): Promise<void> {
        try {
            await this.rabbitMQService.sendMessage('message.created', {
                event: 'MESSAGE_CREATED',
                data: {
                    messageCreated: message
                }
            });
        } catch (error) {
            this.logger.error(`Failed to publish message: ${error.message}`);
            // Système de retry pourrait être implémenté ici
        }
    }

    async findMessagesByConversation(
        conversationId: string,
        limit: number = 20
    ): Promise<Message[]> {
        try {
            // 1. Envoyer la demande
            await this.rabbitMQService.sendMessage('message.findByConversation', {
                conversationId,
                limit
            });

            // 2. Recevoir la réponse sur une queue dédiée
            const response = await this.rabbitMQService.receiveMessage(
                `message.findByConversation.response.${conversationId}`
            );

            return response.messages;
        } catch (error) {
            this.logger.error(`Failed to find messages: ${error.message}`);
            throw new Error('Could not retrieve messages');
        }
    }
}