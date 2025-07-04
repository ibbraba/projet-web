import { ObjectType, Field, ID } from '@nestjs/graphql';
import {UserStatus} from "../enums/user-status.enum";
import {Exclude} from "class-transformer";

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    mail: string;

    @Exclude()
    password?: string;

    @Field()
    createdAt: Date;

    @Field()
    name: string;
    
    @Field({ nullable: true })
    firstName?: string; 

    @Field({ nullable: true })
    phone?: string;

}