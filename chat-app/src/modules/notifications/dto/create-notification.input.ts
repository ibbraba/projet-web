import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";
import {User} from "../../users/models/user.model";
import {NotificationType} from "../enums/notification-type.enum";

@InputType()
export class CreateNotificationInput {
    @Field(() => User)
    @IsNotEmpty()
    receiver: User;

    @Field(() => User, { nullable: true })
    sender?: User;

    @Field(() => NotificationType)
    notificationType: NotificationType;

    @Field()
    @IsNotEmpty()
    message: string;
}