import {Injectable, NotFoundException} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {Conversation} from "../models/conversation.model";
import {CreateConversationInput} from "../dto/create-conversation.input";
import {RabbitMQService} from "../../../core/rabbitmq/rabbitmq.service";

const pubSub = new PubSub();

@Injectable()
export class ConversationsService {
    public readonly conversationQueue: string = 'conversation.queue';
    public readonly conversationReplyQueue: string = 'conversation.response';
    constructor(private readonly rabbitMQService: RabbitMQService) { }

    async create(input: CreateConversationInput): Promise<Conversation> {
        const conversation: Conversation = {
            id: Date.now().toString(),
            participantIds: input.participantIds,
            title: input.title,
            lastMessage: null,
            unreadCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return await this.rabbitMQService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'create', {conversation: conversation});
    }

    async findAll(): Promise<Conversation[]> {
        return await this.rabbitMQService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'findAll', {});
    }

    async findConversationById(conversationId: string): Promise<Conversation> {
        return await this.rabbitMQService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'findOne', {conversationId: conversationId});
    }

    async validate(id: string): Promise<Conversation> {
        return this.findConversationById(id);
    }

    // ... autres méthodes
}