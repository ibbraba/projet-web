import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ConversationService } from './conversation/conversation.service';
import { MessagesService } from './message/message.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [AppService, PrismaService, ConversationService, MessagesService, UserService],
})
export class AppModule {

}
