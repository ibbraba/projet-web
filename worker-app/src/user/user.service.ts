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
                 private readonly rabbitmqService : RabbitMQService
    ) { }

      public channel: amqp.Channel;
        async onModuleInit(){
            console.log("User service initialized");
            this.channel = this.rabbitmqService.getChannel();
    
            await this.channel.assertExchange('test.exchange', 'direct', { durable: true });
            await this.channel.assertQueue('user.queue', { durable: true });
            await this.channel.bindQueue('user.queue', 'test.exchange', 'user.test');
    
            await this.rabbitmqService.publishToExchange('test.exchange', 'user.test', {
                message: Buffer.from('Hello from rabbitmq-wrapper!'),
            });
            
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
}
