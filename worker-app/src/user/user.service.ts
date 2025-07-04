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

        await this.channel.assertExchange('chatapp.exchange', 'direct', { durable: true });
        await this.channel.assertQueue('user.queue', { durable: true });
        await this.channel.bindQueue('user.queue', 'chatapp.exchange', 'user.req');

        await this.channel.assertQueue('user.response', { durable: true });
        await this.channel.bindQueue('user.response', 'chatapp.exchange', 'user.res');


        await this.rabbitmqService.consumeQueue("user.queue", (user) => this.handleUser(user))
      //  await this.testPublishUser1()
       // await this.testPublishUser2()

    }

    async handleUser(req: { operation: string; data : any, requestId: string }) {
        const { operation, data, requestId } = req;

        switch (operation) {
            case 'create':
                try {
                const createResponse = await this.create(data);
                console.log(this.logServiceName + "New user created");
                console.log('reqId :', requestId);
                
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", createResponse, requestId);
                } catch (error) {
                    console.error(this.logServiceName + "Error creating user: ", error);    
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }   
                break;

            case 'update':
                try {
                const updateResponse = await this.update(data.id, data);
                console.log(this.logServiceName + `User with ID ${data.id} updated`);
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", updateResponse, requestId);
                } catch (error) {
                    console.error(this.logServiceName + "Error updating user: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                };
                break;

            case 'delete':
                try {
                await this.remove(req.data.id);
                console.log(this.logServiceName + `user with ID  ${req.data.id} deleted`);
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", "Deleted with success", requestId)
                } catch (error) {
                    console.error(this.logServiceName + "Error deleting user: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }
                break;

            case 'findOne':
                try {
                const findOneResponse = await this.findOne(req.data.id);
                console.log(this.logServiceName + `user with Id ${req.data.id} found`);
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", findOneResponse, requestId)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding user: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }
                break;

            case 'findAll':
                try {
                const findAllResponse = await this.findAll();
                console.log(this.logServiceName + "Find all request received");
                await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", findAllResponse, requestId)
                } catch (error) {
                    console.error(this.logServiceName + "Error finding all users: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }
                break;

            case 'login':
                try {
                    const loginResponse = await this.loginUser(data.mail);
                    console.log(this.logServiceName + `User with username ${req.data.username} logged in`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", loginResponse, requestId)
                } catch (error) {
                    console.error(this.logServiceName + "Error logging in user: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }
                break;

            case 'findByEmail':
                try {
                    const user = await this.prisma.user.findUnique({
                        where : { mail: req.data.mail },
                    });
                    if (!user) {
                        throw new Error(`User with email ${req.data.mail} not found`);
                    }
                    console.log(this.logServiceName + `User with email ${req.data.mail} found`);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", user, requestId);
                } catch (error) {
                    console.error(this.logServiceName + "Error finding user by email: ", error);
                    await this.rabbitmqService.publishToExchange("chatapp.exchange", "user.res", { error: error.message }, requestId);
                }
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

    async loginUser(mail: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { mail},
        
        });
        if (!user) {
            throw Error("Invalid credentials"); // or throw an error if you prefer
        }


        return user;
    }

    /*
    async testPublishUser1(){
          await this.rabbitmqService.publishToExchange('chatapp.exchange', 'user.req', {
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
          await this.rabbitmqService.publishToExchange('chatapp.exchange', 'user.req', {
            operation : "create",
            user : { username: "User2",
                password: "password",
                name: "Doe",
                firstName: "Jane",
                mail: "test2@test.com",
                phone: "025604030"  },
        });
    }
    */
}
