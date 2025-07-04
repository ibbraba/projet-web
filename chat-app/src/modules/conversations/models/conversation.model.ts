import { ObjectType, Field, ID } from '@nestjs/graphql';
import {User} from "../../users/models/user.model";
import { Message } from '../../messages/models/message.model';

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field(() => [ID], { nullable: true })
    participantIds?: string[];

    @Field(() => [User], { nullable: true })
    participants?: User[];

    @Field(() => [Message], { nullable: true })
    messages?: Message[];

    @Field()
    title: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}