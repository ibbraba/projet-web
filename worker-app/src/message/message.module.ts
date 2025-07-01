import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesService } from './message.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';


@Module({
  providers: [MessagesService, PrismaService, RabbitMQService],
  exports: [MessagesService],
})
export class MessagesModule {}
