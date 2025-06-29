/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import * as amqp from 'amqplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class ConversationService implements OnModuleInit {
    constructor(private readonly prismaService: PrismaService,
        private readonly rabbitmqService: RabbitMQService
    ) { }

    public channel: amqp.Channel;
    async onModuleInit() {
        console.log("Conversation service initialized");
        this.channel = this.rabbitmqService.getChannel();

        await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('conversation.queue', { durable: true });
        await this.channel.bindQueue('conversation.queue', 'test.exchange', 'conversation.test');

         await this.channel.assertQueue('conversation.response', { durable: true });
        await this.channel.bindQueue('conversation.response', 'test.exchange', 'conversation.res');


        await this.rabbitmqService.consumeQueue("conversation.queue", (conversation) => this.handleConversation(conversation))
        await this.testPublish()
    }

    async handleConversation(req: { operation: string; conversation : any }) {
        const { operation, conversation } = req;

        switch (operation) {
            case 'create':
                const createResponse = await this.create(conversation);
                console.log("New Conversation created");            
                await this.rabbitmqService.publishToExchange("test.exchange", "conversation.res", createResponse)
                break;

            case 'update':
                const updateResponse = await this.update(req.conversation.id, req.conversation);
                console.log(`Conversation with ID ${req.conversation.id} updated`);   
                  await this.rabbitmqService.publishToExchange("test.exchange", "conversation.res", updateResponse)
                break;

            case 'delete':
                await this.remove(req.conversation.id);
                console.log(`Conversation with ID  ${req.conversation.id} deleted`);
                await this.rabbitmqService.publishToExchange("test.exchange", "conversation.res", "Deleted with success")
                break;

            case 'findOne':
                const findOneResponse = await this.findOne(req.conversation.id);
                // Optionally publish result back to another queue
                console.log(`Conversation with Id ${req.conversation.id} found`);
                 await this.rabbitmqService.publishToExchange("test.exchange", "conversation.res", findOneResponse)
                break;

            case 'findAll':
                const findAllResponse = await this.findAll();
                console.log("Find all request received");
                
                // Optionally publish result back to another queue
                 await this.rabbitmqService.publishToExchange("test.exchange", "conversation.res", findAllResponse)
                break;
        }
    }


    async findAll(): Promise<Conversation[]> {
        return this.prismaService.conversation.findMany({
            include: {
                messages: true,
                participants: true,
            },
        });
    }

    async findOne(id: string): Promise<Conversation | null> {
        return this.prismaService.conversation.findUnique({
            where: { id },
            include: {
                messages: true,
                participants: true,
            },
        });
    }

    async findUserConversations(userId: string) {

        return this.prismaService.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                participants: true,
                messages: true// optionally include participants info
                // include messages or other relations as needed
            },
        });
    }

    async create(data: { title?: string }): Promise<Conversation> {
        return this.prismaService.conversation.create({
            data,
        });
    }

    async update(id: string, data: Partial<Conversation>): Promise<Conversation> {
        return this.prismaService.conversation.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Conversation> {
        return this.prismaService.conversation.delete({
            where: { id },
        });
    }

    //Test method TODO : Delete
    async testPublish(){
          await this.rabbitmqService.publishToExchange('test.exchange', 'conversation.test', {
            operation : "findOne",
            conversation : { id : "5dc94624-f89e-4faa-ab4d-7951b0fbbba6" },
        });
    }
}
