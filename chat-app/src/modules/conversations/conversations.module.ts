import { Module } from '@nestjs/common';
import {ConversationsService} from "./services/conversations.service";
import {ConversationsResolver} from "./resolvers/conversations.resolver";
import {pubSubProvider} from "../../common/pubsub.provider";

@Module({
    exports: [ConversationsService],
    providers: [
        ConversationsResolver,
        ConversationsService,
        pubSubProvider,
    ],
})
export class ConversationsModule {}