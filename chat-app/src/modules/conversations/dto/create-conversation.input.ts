import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateConversationInput {
    @Field()
    @IsNotEmpty()
    participantIds: [] = [];

    @Field()
    @IsNotEmpty()
    title: string;
}