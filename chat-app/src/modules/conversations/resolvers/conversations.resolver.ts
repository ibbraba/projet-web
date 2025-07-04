import {Resolver, Query, Mutation, Args, Parent, ResolveField} from '@nestjs/graphql';
import {Conversation} from "../models/conversation.model";
import {ConversationsService} from "../services/conversations.service";
import {CreateConversationInput} from "../dto/create-conversation.input";
import {UpdateConversationInput} from "../dto/update-conversation";
import {User} from "../../users/models/user.model";
import {UsersService} from "../../users/services/users.service";

@Resolver(() => Conversation)
export class ConversationsResolver {
    constructor(
        private readonly conversationsService: ConversationsService,
        private usersService: UsersService
    ) {}

    @ResolveField(() => [User])
    async participants(@Parent() conversation: Conversation) {
        // Implémentation basique sans DataLoader
        const users = await Promise.all(
            conversation.participantIds.map(id =>
                this.usersService.findUserById(id) // Votre méthode custom
            )
        );
        return users.filter(user => user !== null); // Filtre les utilisateurs non trouvés
    }

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
