import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports : [RabbitMQModule],
  providers: [ConversationService, PrismaService, RabbitMQService],
  exports: [ConversationService],
})
export class ConversationModule {}
