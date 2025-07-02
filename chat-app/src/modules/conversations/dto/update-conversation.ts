import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {User} from "../../users/models/user.model";

@InputType()
export class UpdateConversationInput {
    @Field(() => [User])
    @IsNotEmpty()
    participantIds: string;

    @Field()
    @IsNotEmpty()
    title: string;
}