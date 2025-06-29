import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [UserService, PrismaService, RabbitMQService],
  exports: [UserService], // Export if other modules need it
})
export class UserModule {}
