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

        await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('message.queue', { durable: true });
        await this.channel.bindQueue('message.queue', 'test.exchange', 'message.test');

        await this.channel.assertQueue('message.response', { durable: true });
        await this.channel.bindQueue('message.response', 'test.exchange', 'message.res');


        await this.rabbitmqService.consumeQueue("message.queue", (message) => this.handleMessage(message))

       // await this.testPublishMessage1()
       // await this.testPublshMessage2()

    }

    async handleMessage(req: { operation: string; message: any }) {
        const { operation, message } = req;

        switch (operation) {
            case 'create':
                const createResponse = await this.create(message);
                console.log(this.logServiceName + "New message created");
                await this.rabbitmqService.publishToExchange("test.exchange", "message.res", createResponse)
                break;

            case 'update':
                const updateResponse = await this.update(req.message.id, req.message);
                console.log(this.logServiceName + `message with ID ${req.message.id} updated`);
                await this.rabbitmqService.publishToExchange("test.exchange", "message.res", updateResponse)
                break;

            case 'delete':
                await this.remove(req.message.id);
                console.log(this.logServiceName + `message with ID  ${req.message.id} deleted`);
                await this.rabbitmqService.publishToExchange("test.exchange", "message.res", "Deleted with success")
                break;

            case 'findOne':
                const findOneResponse = await this.findOne(req.message.id);
                // Optionally publish result back to another queue
                console.log(this.logServiceName + `message with Id ${req.message.id} found`);
                await this.rabbitmqService.publishToExchange("test.exchange", "message.res", findOneResponse)
                break;

            case 'findAll':
                const findAllResponse = await this.findAll();
                console.log(this.logServiceName + "Find all request received");

                // Optionally publish result back to another queue
                await this.rabbitmqService.publishToExchange("test.exchange", "message.res", findAllResponse)
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

    //Test method TODO : Delete
    async testPublishMessage1() {
        await this.rabbitmqService.publishToExchange('test.exchange', 'message.test', {
            operation: "create",
            message: {
                content: "Hello ca va ?",
                senderId: "27eb1726-56aa-4d68-a710-e94f6825084f",
                conversationId: "5dc94624-f89e-4faa-ab4d-7951b0fbbba6"
            },
        });
    }

    //Test method TODO : Delete
    async testPublshMessage2() {
        await this.rabbitmqService.publishToExchange('test.exchange', 'message.test', {
            operation: "create",
            message: {
                content: "Bien et toi? ",
                senderId: "bdd69dee-10e8-4731-a3c1-e33a0a12e2a2",
                conversationId: "5dc94624-f89e-4faa-ab4d-7951b0fbbba6"
            },
        });
    }
}
