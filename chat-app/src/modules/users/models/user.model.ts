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
    lastSeen: Date;

    @Field()
    status: UserStatus;

    @Field()
    createdAt: Date;

    @Field({ nullable: true })
    avatarUrl?: string;

    @Field(() => Boolean, { defaultValue: false })
    isAdmin: boolean = false;

}