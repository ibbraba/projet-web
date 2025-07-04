import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PublicUser {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    createdAt: Date;
}