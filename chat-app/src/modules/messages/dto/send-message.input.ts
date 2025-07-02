import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
    @Field()
    @IsNotEmpty()
    conversationId: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    senderId: string;
}