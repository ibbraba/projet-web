import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { Message } from '../models/message.models';
import {Inject} from "@nestjs/common";
import {PUB_SUB} from "../../../common/constants";
import {PubSub} from "graphql-subscriptions"; // Utilisez un token constant

@Resolver(() => Message)
export class MessagesSubscriptions {
    constructor(
        @Inject(PUB_SUB) private readonly pubSub: PubSub // Injection propre
    ) {}

    @Subscription(() => Message, {
        name: 'messageReceived',
        filter: (payload, variables) =>
            payload.messageReceived.conversationId === variables.conversationId,
        resolve: (value) => value.messageReceived,
    })
    subscribeToNewMessages(
        @Args('conversationId') _conversationId: string // _ indique une var non utilisée
    ) {
        return this.pubSub.asyncIterableIterator('MESSAGE_RECEIVED');
    }

    @Subscription(() => String, {
        name: 'typingUser',
        filter: (payload, variables) =>
            payload.conversationId === variables.conversationId,
    })
    subscribeToTypingEvents(
        @Args('conversationId') conversationId: string
    ) {
        return this.pubSub.asyncIterableIterator(`TYPING_${conversationId}`);
    }
}