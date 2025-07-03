import {InputType, Field, ID} from '@nestjs/graphql';
import {ArrayNotEmpty, IsArray, IsNotEmpty} from 'class-validator';
import {User} from "../../users/models/user.model";

@InputType()
export class CreateConversationInput {
    @Field(() => [ID])
    @IsArray()
    @ArrayNotEmpty()
    @IsNotEmpty({ each: true })
    participantIds: string[];

    @Field()
    @IsNotEmpty()
    title: string;
}