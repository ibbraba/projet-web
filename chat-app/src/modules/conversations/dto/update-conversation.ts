import {InputType, Field, ID} from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {User} from "../../users/models/user.model";

@InputType()
export class UpdateConversationInput {
    @Field(() => [ID])
    @IsNotEmpty()
    participantIds: string;

    @Field()
    @IsNotEmpty()
    title: string;
}