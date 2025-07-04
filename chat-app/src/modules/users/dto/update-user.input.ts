import {Field, InputType} from "@nestjs/graphql";
import {IsOptional, IsUrl, MaxLength} from "class-validator";

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(20)
    username?: string;

    @Field({ nullable: true })
    @IsOptional()
    isAdmin?: boolean = false;
}