import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    @MaxLength(20)
    username: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(8)
    password: string;

    @Field()
    isAdmin: boolean = false;
}