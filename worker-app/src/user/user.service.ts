/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { User } from '@prisma/client'; // Import your Prisma User model type
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService,
        private readonly rabbitmqService: RabbitMQService
    ) { }

    private logServiceName : string = "UserService : "
    public channel: amqp.Channel;
    async onModuleInit() {
        console.log(this.logServiceName + "User service initialized");
        this.channel = this.rabbitmqService.getChannel();

        await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('user.queue', { durable: true });
        await this.channel.bindQueue('user.queue', 'test.exchange', 'user.test');

        await this.channel.assertQueue('user.response', { durable: true });
        await this.channel.bindQueue('user.response', 'test.exchange', 'user.res');


        await this.rabbitmqService.consumeQueue("user.queue", (user) => this.handleUser(user))
        await this.testPublishUser1()
        await this.testPublishUser2()

    }

    async handleUser(req: { operation: string; user : any }) {
        const { operation, user } = req;

        switch (operation) {
            case 'create':
                const createResponse = await this.create(user);
                console.log(this.logServiceName + "New user created");
                await this.rabbitmqService.publishToExchange("test.exchange", "user.res", createResponse)
                break;

            case 'update':
                const updateResponse = await this.update(req.user.id, req.user);
                console.log(this.logServiceName + `User with ID ${req.user.id} updated`);
                await this.rabbitmqService.publishToExchange("test.exchange", "user.res", updateResponse)
                break;

            case 'delete':
                await this.remove(req.user.id);
                console.log(this.logServiceName + `user with ID  ${req.user.id} deleted`);
                await this.rabbitmqService.publishToExchange("test.exchange", "user.res", "Deleted with success")
                break;

            case 'findOne':
                const findOneResponse = await this.findOne(req.user.id);
                // Optionally publish result back to another queue
                console.log(this.logServiceName + `user with Id ${req.user.id} found`);
                await this.rabbitmqService.publishToExchange("test.exchange", "user.res", findOneResponse)
                break;

            case 'findAll':
                const findAllResponse = await this.findAll();
                console.log(this.logServiceName + "Find all request received");

                // Optionally publish result back to another queue
                await this.rabbitmqService.publishToExchange("test.exchange", "user.res", findAllResponse)
                break;
        }
    }


    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(data: UserInfoInput): Promise<User> {
        return this.prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                name: data.name,
                firstName: data.firstName,
                mail: data.mail,
                phone: data.phone || '',  // or leave undefined if optional in your DB
            },
        })
    }

    async update(id: string, data: Partial<UserInfoInput>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    async remove(id: string): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }

    async testPublishUser1(){
          await this.rabbitmqService.publishToExchange('test.exchange', 'user.test', {
            operation : "create",
            user : { username: "User1",
                password: "password",
                name: "Doe",
                firstName: "John",
                mail: "test@test.com",
                phone: "055604030"  },
        });
    }

      async testPublishUser2(){
          await this.rabbitmqService.publishToExchange('test.exchange', 'user.test', {
            operation : "create",
            user : { username: "User2",
                password: "password",
                name: "Doe",
                firstName: "Jane",
                mail: "test2@test.com",
                phone: "025604030"  },
        });
    }
}
