import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Conversation } from '../../conversations/models/conversation.models';
import {MessageStatus} from "../enums/message-status.enum";

@ObjectType()
export class Message {
    @Field(() => ID)
    id: string;

    @Field()
    content: string;

    @Field(() => User)
    sender: User;

    @Field(() => Conversation)
    conversation: Conversation;

    @Field()
    status: MessageStatus;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}