import { ObjectType, Field, ID } from '@nestjs/graphql';
import {User} from "../../users/models/user.model";

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field(() => [ID])
    participantIds: string[];

    @Field(() => [User], { nullable: true })
    participants?: User[];

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