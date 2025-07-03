/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../models/user.model';
import { UserStatus } from '../enums/user-status.enum';
import { PublicUser } from '../models/public-user.model';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';

@Injectable()
export class UsersService {
    constructor(private readonly rabbitMQService: RabbitMQService) { }

    private readonly userQueue: string = 'user.queue';
    private readonly userReplyQueue: string = 'user.response';
    private readonly logger = new Logger(UsersService.name);
    private readonly users: User[] = [];

    async create(input: CreateUserInput): Promise<User> {
        const req: any = {
            username: input.username,
            password: input.password,
            name: input.name,
            firstName: input.firstName,
            mail: input.mail,
            phone: input.phone,
        };
        try {
            const response = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'create',
                req,
            );
            this.logger.debug(
                `User creation acknowledged by service: ${this.userQueue}`,
            );
            return response;
        } catch (error) {
            this.logger.error('Failed to get creation acknowledgment', error.stack);
            throw new NotFoundException(`Failed to create user: ${error.message}`);
        }
    }

    async validateUserOnAuthService(
        email: string,
        password: string,
    ): Promise<User> {
        const req: any = {
            email: email,
            password: password,
        };
        try {
            const authResponse = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'login',
                req,
            );
            return authResponse;
        } catch (error) {
            this.logger.error(`Auth validation failed for ${email}`, error.stack);
            throw error;
        }
    }

    async update(userId: string, input: Partial<CreateUserInput>): Promise<User> {
        const req: any = {
            id: userId,
            ...input,
        };
        try {
            const response = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'update',
                req,
            );
            this.logger.debug(
                `User with ID ${userId} updated in service: ${this.userQueue}`,
            );
            return response;
        } catch (error) {
            this.logger.error(`Failed to update user with ID ${userId}`, error.stack);
            throw new NotFoundException(`Failed to update user: ${error.message}`);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'findAll',
                {},
            );
            this.logger.debug(
                `Fetched ${users.length} users from service: ${this.userQueue}`,
            );
            return users;
        } catch (error) {
            this.logger.error('Failed to fetch users', error.stack);
            throw new NotFoundException(`Failed to fetch users: ${error.message}`);
        }
    }

    public async findUserById(userId: string): Promise<User> {
        try {
            const req = {
                id: userId,
            };
            const user = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'findOne',
                req,
            );
            this.logger.debug(
                `User with ID ${userId} fetched from service: ${this.userQueue}`,
            );
            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            return user;
        } catch (error) {
            this.logger.error(`Failed to fetch user with ID ${userId}`, error.stack);
            throw new NotFoundException(`Failed to fetch user: ${error.message}`);
        }
    }


    public async findUserByEmail(userEmail: string): Promise<User> {
        try {
            const req = {
                mail: userEmail,
            };
            const user = await this.rabbitMQService.sendWithReply(
                this.userQueue,
                this.userReplyQueue,
                'findByEmail',
                req,
            );
            this.logger.debug(
                `User with mail ${userEmail} fetched from service: ${this.userQueue}`,
            );
            if (!user) {
                throw new NotFoundException(`User with ID ${userEmail} not found`);
            }
            return user;
        } catch (error) {
            this.logger.error(`Failed to fetch user with ID ${userEmail}`, error.stack);
            throw new NotFoundException(`Failed to fetch user: ${error.message}`);
        }
    }

}
