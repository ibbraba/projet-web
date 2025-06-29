/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class MessagesService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService, 
                 private readonly rabbitmqService : RabbitMQService
    ) { }

    public channel: amqp.Channel;
    async onModuleInit(){
        console.log("Message service initialized");
        this.channel = this.rabbitmqService.getChannel();

        await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('message.queue', { durable: true });
        await this.channel.bindQueue('message.queue', 'test.exchange', 'message.test');

        await this.rabbitmqService.publishToExchange('test.exchange', 'message.test', {
            message: Buffer.from('Hello from rabbitmq-wrapper!'),
        });
        
    }

    async findAll(): Promise<Message[]> {
        return this.prisma.message.findMany();
    }

    async findOne(id: string): Promise<Message | null> {
        return this.prisma.message.findUnique({ where: { id } });
    }

    async create(data: MessageInputInfo): Promise<Message> {
        return this.prisma.message.create({
            data: {
                content: data.content,
                senderId: data.senderId,
                conversationId: data.conversationId,
                sendAt: data.sendAt,  // optional
            },
        });
    }

    async updateMessage(messageId: string, data: MessageInputInfo): Promise<Message> {
        return this.prisma.message.update({
            where: { id: messageId },
            data: {
                ...data,
            },
        });
    }

    async remove(id: string): Promise<Message> {
        return this.prisma.message.delete({ where: { id } });
    }
}
