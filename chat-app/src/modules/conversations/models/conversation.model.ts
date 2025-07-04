import { ObjectType, Field, ID } from '@nestjs/graphql';
import {User} from "../../users/models/user.model";

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field(() => [ID], { nullable: true })
    participantIds?: string[];

    @Field()
    title: string;

    @Field({ nullable: true })
    lastMessage: string;

    @Field()
    unreadCount: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}