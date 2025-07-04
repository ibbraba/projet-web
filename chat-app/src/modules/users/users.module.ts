import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {UsersService} from "./services/users.service";
import {UsersResolver} from "./resolvers/users.resolver";
import {MockUsersService} from "./mocks/users.service.mock";
import {pubSubProvider} from "../../common/pubsub.provider";
import {RabbitMQModule} from "../../core/rabbitmq/rabbitmq.module";

@Module({
    imports: [RabbitMQModule],
    exports: [UsersService],
    providers: [
        UsersResolver,
        UsersService,
        pubSubProvider,
        {
            provide: UsersService,
            useClass: process.env.MOCK_MODE === 'true' ? MockUsersService : UsersService,
        },
    ],
})
export class UsersModule {
    constructor() {
        console.log('UsersModule initialized');        
    }
}