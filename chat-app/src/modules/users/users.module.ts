import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {UsersService} from "./services/users.service";
import {UsersResolver} from "./resolvers/users.resolver";
import {MockUsersService} from "./mocks/users.service.mock";
import {pubSubProvider} from "../../common/pubsub.provider";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
        {
            name: 'RABBITMQ_CLIENT',
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: 'user_updates_queue',
                queueOptions: {
                    durable: true, // Persistance des messages
                    // Autres options si nécessaire :
                    // noAck: false,
                    // prefetchCount: 1
                },
            },
        },
    ]),
    ],
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
export class UsersModule {}