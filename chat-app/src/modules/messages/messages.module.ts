import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesResolver } from './resolvers/messages.resolver';
import {UsersModule} from "../users/users.module";
import {ConversationsModule} from "../conversations/conversations.module";
import {pubSubProvider} from "../../common/pubsub.provider";

@Module({
    imports: [UsersModule, ConversationsModule],
    providers: [
        MessagesService,
        MessagesResolver,
        pubSubProvider,
    ],
})
export class MessagesModule {}