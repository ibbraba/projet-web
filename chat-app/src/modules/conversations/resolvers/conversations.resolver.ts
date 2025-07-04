import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {Conversation} from "../models/conversation.model";
import {ConversationsService} from "../services/conversations.service";
import {CreateConversationInput} from "../dto/create-conversation.input";
import {UpdateConversationInput} from "../dto/update-conversation";

@Resolver(() => Conversation)
export class ConversationsResolver {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Query(() => [Conversation], { name: 'getUserConversations', description: 'Get all conversations' })
    async getUserConversations(@Args('userId') userId: string) {
        return this.conversationsService.findUserConversations(userId);
    }

    @Query(() => Conversation, { name: 'getCurrentConversation', description: 'Get current conversation' })
    async getCurrentConversation(@Args('conversationId') conversationId: string) {
        return this.conversationsService.findConversationById(conversationId);
    }

    @Mutation(() => Conversation, { name: 'createConversation', description: 'Create one conversation', })
    async createConversation(
        @Args('input') input: CreateConversationInput
    ) {
        return await this.conversationsService.create(input);
    }

    async UpdateUser(input: UpdateConversationInput) {

    }
}
