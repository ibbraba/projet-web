/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
        private readonly rabbitmqService: RabbitMQService
    ) { }

    public logServiceName: string = "MessageService : "
    public channel: amqp.Channel;
    async onModuleInit() {
        console.log(this.logServiceName + "Message service initialized");
        this.channel = this.rabbitmqService.getChannel();

        await this.channel.assertExchange('chatapp.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('message.queue', { durable: true });
        await this.channel.bindQueue('message.queue', 'chatapp.exchange', 'message.req');

        await this.channel.assertQueue('message.response', { durable: true });
        await this.channel.bindQueue('message.response', 'chatapp.exchange', 'message.res');


        await this.rabbitmqService.consumeQueue("message.queue", (message) => this.handleMessage(message))
        /*
        await this.testPublishMessage1()
        await this.testPublshMessage2()
        */
    }

    async handleMessage(req: { operation: string; message: any }) {
        const { operation, message } = req;

        switch (operation) {
            case 'create':
                try {
                    const createResponse = await this.create(message);
                    console.log(this.logServiceName + "New message created");
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", createResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error creating message: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", { error: error.message });
                }
                break;

            case 'update':
                try {
                    const updateResponse = await this.update(req.message.id, req.message);
                    console.log(this.logServiceName + `message with ID ${req.message.id} updated`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", updateResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error updating message: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", { error: error.message });
                }
                break;

            case 'delete':
                try {
                    await this.remove(req.message.id);
                    console.log(this.logServiceName + `message with ID  ${req.message.id} deleted`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", "Deleted with success")
                } catch (error) {
                    console.error(this.logServiceName + "Error deleting message: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", { error: error.message });
                }
                break;

            case 'findOne':
                try {
                    const findOneResponse = await this.findOne(req.message.id);
                    // Optionally publish result back to another queue
                    console.log(this.logServiceName + `message with Id ${req.message.id} found`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", findOneResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding message: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", { error: error.message });
                }
                break;

            case 'findAll':
                try {
                    const findAllResponse = await this.findAll();
                    console.log(this.logServiceName + "Find all request received");
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", findAllResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding all messages: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "message.res", { error: error.message });
                }
                break;
        }
    }


    async findAll(): Promise<Message[]> {
        return this.prisma.message.findMany();
    }

    async findOne(id: string): Promise<Message | null> {
        return this.prisma.message.findUnique({ where: { id } });
    }

    async create(data: MessageInputInfo): Promise<Message> {


        const isParticipant = await this.prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: data.senderId,
                    conversationId: data.conversationId,
                },
            },
        });

        if (!isParticipant) {
            throw new Error('User is not a participant in this conversation.');
        }
        return this.prisma.message.create({
            data: {
                content: data.content,
                senderId: data.senderId,
                conversationId: data.conversationId,
                sendAt: new Date()
            },
        });
    }

    async update(messageId: string, data: MessageInputInfo): Promise<Message> {
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

     /*
        //Test method TODO : Delete
        async testPublishMessage1() {
            await this.rabbitmqService.publishToExchange('chatapp.exchange', 'message.req', {
                operation: "create",
                message: {
                    content: "Hello ca va ?",
                    senderId: "0d95023e-2912-4504-891b-63cb6a7f5e02",
                    conversationId: "7ec6ea9b-d5f4-4f42-b226-11a2141f9700"
                },
            });
        }
    
        //Test method TODO : Delete
        async testPublshMessage2() {
            await this.rabbitmqService.publishToExchange('chatapp.exchange', 'message.req', {
                operation: "create",
                message: {
                    content: "Bien et toi? ",
                    senderId: "1c6e8d5f-8d0d-491d-bc69-2ee2cd8054a3",
                    conversationId: "7ec6ea9b-d5f4-4f42-b226-11a2141f9700"
                },
            });
        }
        */
}
