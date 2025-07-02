import {InputType, Field, ID} from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {User} from "../../users/models/user.model";

@InputType()
export class CreateConversationInput {
    @Field(() => [ID])
    @IsNotEmpty()
    participantIds: [] = [];

    @Field()
    @IsNotEmpty()
    title: string;
}