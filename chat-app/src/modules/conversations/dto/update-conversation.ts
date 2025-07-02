import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateConversationInput {
    @Field()
    @IsNotEmpty()
    participantIds: string;

    @Field()
    @IsNotEmpty()
    title: string;
}