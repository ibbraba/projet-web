import { ObjectType, Field } from '@nestjs/graphql';
import {User} from "../../modules/users/models/user.model";

@ObjectType()
export class LoginResponse {
    @Field(() => String)
    access_token: string;

    @Field(() => User)
    user: User;
}