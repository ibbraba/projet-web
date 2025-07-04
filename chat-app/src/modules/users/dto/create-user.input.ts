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
    mail: string;

    @Field()
    @MinLength(8)
    password: string;

    @Field({ nullable: true })
    @MaxLength(50)
    firstName?: string;

    @Field({ nullable: true })
    @MaxLength(50)
    name?: string;

    @Field({ nullable: true })
    @MaxLength(15)  
    phone?: string;
}