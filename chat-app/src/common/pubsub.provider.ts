import { Provider } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions'; // Pour la production
import { PUB_SUB } from './constants';

// Version développement (mémoire)
export const pubSubProvider: Provider = {
    provide: PUB_SUB,
    useValue: new PubSub(), // Simple in-memory PubSub
};

// Version production (Redis)
/*
export const pubSubProvider: Provider = {
  provide: PUB_SUB,
  useFactory: () => new RedisPubSub({
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    }
  }),
};
*/