import {Injectable, NotFoundException} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {Conversation} from "../models/conversation.model";
import {CreateConversationInput} from "../dto/create-conversation.input";

const pubSub = new PubSub();

@Injectable()
export class ConversationsService {
    private readonly conversations: Conversation[] = []; // En vrai, utilisez TypeORM/Mongoose

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

        this.conversations.push(conversation);
        return conversation;
    }

    async findAll(): Promise<Conversation[]> {
        return this.conversations;
    }

    async findConversationById(conversationId: string): Promise<Conversation> {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) {
            throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
        }
        return conversation;
    }

    async validate(id: string): Promise<Conversation> {
        return this.findConversationById(id);
    }

    // ... autres méthodes
}