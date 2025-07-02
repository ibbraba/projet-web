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
    private logServiceName: string = "ConversationService : "
    public channel: amqp.Channel;
    async onModuleInit() {
        console.log(this.logServiceName + "Conversation service initialized");
        this.channel = this.rabbitmqService.getChannel();

        await this.channel.assertExchange('chatapp.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('conversation.queue', { durable: true });
        await this.channel.bindQueue('conversation.queue', 'chatapp.exchange', 'conversation.req');

        await this.channel.assertQueue('conversation.response', { durable: true });
        await this.channel.bindQueue('conversation.response', 'chatapp.exchange', 'conversation.res');


        await this.rabbitmqService.consumeQueue("conversation.queue", (conversation) => this.handleConversation(conversation))
        // await this.testCreateConversation()


    }

    async handleConversation(req: { operation: string; conversation: any }) {
        const { operation, conversation } = req;

        switch (operation) {
            case 'create':
                try {
                    const createResponse = await this.create(conversation);
                    console.log(this.logServiceName + "New conversation created");
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", createResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error creating conversation: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", { error: error.message });
                }
                break;

            case 'update':
                try {
                    const updateResponse = await this.update(req.conversation.id, req.conversation);
                    console.log(this.logServiceName + `Conversation with ID ${req.conversation.id} updated`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", updateResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error updating conversation: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", { error: error.message });
                    return;
                }

                break;

            case 'delete':
                try{
                    await this.remove(req.conversation.id);
                    console.log(this.logServiceName + `Conversation with ID  ${req.conversation.id} deleted`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", "Deleted with success")                    
                }catch (error) {
                    console.error(this.logServiceName + "Error deleting conversation: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", { error: error.message });
                }   
                break;

            case 'findOne':
                try {
                const findOneResponse = await this.findOne(req.conversation.id);
                console.log(this.logServiceName + `Conversation with Id ${req.conversation.id} found`);
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", findOneResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding conversation: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", { error: error.message });
                }
                break;

            case 'findAll':
                try {
                const findAllResponse = await this.findAll();
                console.log(this.logServiceName + "Find all request received");
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", findAllResponse)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding all conversations: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "conversation.res", { error: error.message });
                }
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

    async create(data: { title?: string, participantIds: string[] }): Promise<Conversation> {

        const { title, participantIds } = data;

        const isAlreadyCreated = await this.findExistingConversation(participantIds)
        if (isAlreadyCreated) {

            const conversationCreated = await this.findOne(isAlreadyCreated.id)
            if (conversationCreated) {
                console.log(this.logServiceName + "Forwading to already created conversation");
                return conversationCreated
            }

        }

        console.log(this.logServiceName + "New Conversation created");
        return this.prismaService.conversation.create({
            data: {
                title,
                participants: {
                    create: participantIds.map((userId) => ({
                        user: { connect: { id: userId } },
                    })),
                },
            },
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

    async addParticipant(userId: string, conversationId: string) {

        //Check si le participant est déja ajouté
        const existingParticipant = await this.prismaService.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId,
                    conversationId,
                },
            },
        });

        if (existingParticipant) {
            throw new Error('User is already a participant in this conversation.');
        }

        const participant = await this.prismaService.conversationParticipant.create({
            data: {
                user: { connect: { id: userId } },
                conversation: { connect: { id: conversationId } },
            },
        });

        return participant
    }


    // Find conversations where ALL the userIds are participants
    async findExistingConversation(userIds: string[]) {
        const conversations = await this.prismaService.conversation.findMany({
            where: {
                participants: {
                    every: {
                        userId: { in: userIds },
                    },
                },
            },
            include: {
                participants: true,
            },
        });

        // Filter to only those conversations that include exactly these users
        const exactMatch = conversations.find((conversation) => {
            const participantIds = conversation.participants.map(p => p.userId);
            return (
                participantIds.length === userIds.length &&
                userIds.every(id => participantIds.includes(id))
            );
        });

        return exactMatch || null;
    }


    //Test method TODO : Delete
    /*
    async testCreateConversation() {
        await this.rabbitmqService.publishToExchange('chatapp.exchange', 'conversation.req', {
            operation: "create",
            conversation: {
                title: "Must fail",
                participantIds: ["0d95023e-2912-4504-891b-63cb6a7f5e02", "1c6e8d5f-8d0d-491d-bc69-2ee2cd8054a3"]

            },
        });
    }
    */
}
