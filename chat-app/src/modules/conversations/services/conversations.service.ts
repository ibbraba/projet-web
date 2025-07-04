import {Injectable, NotFoundException} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {Conversation} from "../models/conversation.model";
import {CreateConversationInput} from "../dto/create-conversation.input";
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { title } from 'process';

const pubSub = new PubSub();

@Injectable()
export class ConversationsService {
   constructor(private readonly rabbitmqService: RabbitMQService) {}    
    public readonly conversationQueue : string = 'conversation.queue';
    public readonly conversationReplyQueue : string = 'conversation.response';


    async create(input: CreateConversationInput): Promise<Conversation> {
        const request : any = {           
            participantIds: input.participantIds,
            title: input.title,
        };

        const conversation = this.rabbitmqService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'create', request);
        return conversation;
    }

    async findAll(): Promise<Conversation[]> {
        const request = {
            data: {}
        };

        const conversation = this.rabbitmqService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'findAll', request);
        return conversation;
    }

    async findUserConversations(userId: string): Promise<Conversation[]> {
        const request = {
            userId: userId
        };
        const conversations = await this.rabbitmqService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'findUserConversations', request);
        if (!conversations || conversations.length === 0) {
            throw new NotFoundException(`No conversations found for user with ID ${userId}`);
        }
        return conversations;
    }

    async findConversationById(conversationId: string): Promise<Conversation> {
        const request = {
            id: conversationId
        };
        const conversation = await this.rabbitmqService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'findOne', request);
        if (conversation || conversation.length === 0) {
            throw new NotFoundException(`No conversations found with ID ${conversationId}`);
        }
        return conversation;
    }

    async update(id: string, title : string): Promise<Conversation> {
        const request = {
            id: id,
            title  : title
        };

        const conversation = await this.rabbitmqService.sendWithReply(this.conversationQueue, this.conversationReplyQueue, 'update', request);
        return conversation;
    }

    // ... autres méthodes
}