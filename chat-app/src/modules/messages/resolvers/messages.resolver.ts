import {Resolver, Query, Mutation, Args, Subscription} from '@nestjs/graphql';
import { MessagesService } from '../services/messages.service';
import { Message } from '../models/message.model';
import { SendMessageInput } from '../dto/send-message.input';
import {Inject, UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../auth/guards/gql-auth.guard";
import {PUB_SUB} from "../../../common/constants";
import {PubSub} from "graphql-subscriptions";

@Resolver(() => Message)
//@UseGuards(GqlAuthGuard)
export class MessagesResolver {
    constructor(
        @Inject(PUB_SUB) private pubSub: PubSub,
        private messagesService: MessagesService
    ) {}


    @Mutation(() => Message, { name: 'sendMessage', description: 'Sends a message' })
    async sendMessage(
        @Args('input') input: SendMessageInput
    ) {
        const message = this.messagesService.createMessage(input)
        await this.pubSub.publish('MESSAGE_RECEIVED', {
            messageReceived: message,
        });
        return message;
    }
}
