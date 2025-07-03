import { Module } from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {ConversationsModule} from "../conversations/conversations.module";
import {pubSubProvider} from "../../common/pubsub.provider";
import {RabbitMQModule} from "../../core/rabbitmq/rabbitmq.module";
import {NotificationsService} from "./services/notifications.service";
import {NotificationsResolver} from "./resolvers/notifications.resolver";

@Module({
    imports: [UsersModule, ConversationsModule, RabbitMQModule],
    providers: [
        NotificationsService,
        NotificationsResolver,
        pubSubProvider,
    ],
})
export class MessagesModule {}