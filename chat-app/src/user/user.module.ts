/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserProducerService } from './user.producer';

@Module({
  controllers: [UserController],
  providers: [UserProducerService],
})
export class UserModule {}
