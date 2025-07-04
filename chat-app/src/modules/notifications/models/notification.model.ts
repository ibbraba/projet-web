import {Field, ID, ObjectType} from "@nestjs/graphql";
import {User} from "../../users/models/user.model";
import {NotificationType} from "../enums/notification-type.enum";

@ObjectType()
export class Notification {
    @Field(() => ID)
    id: string;

    @Field(() => NotificationType)
    notificationType: NotificationType;

    @Field()
    message: string;

    @Field(() => User, { nullable: true })
    sender?: User;

    @Field(() => User)
    recipient: User;

    @Field({ defaultValue: false })
    read: boolean;

    @Field(() => Date)
    createdAt: Date;
}