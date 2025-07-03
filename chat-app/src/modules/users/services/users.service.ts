import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from "../dto/create-user.input";
import { User } from "../models/user.model";
import { UserStatus } from "../enums/user-status.enum";
import { PublicUser } from "../models/public-user.model";
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    private readonly logger = new Logger(UsersService.name);
    private readonly users: User[] = [];

    async updateLastSeen(userId: string): Promise<void> {
        const user = await this.findUserById(userId);
        user.lastSeen = new Date();

        try {
            await this.rabbitMQService.send('user_updates', {
                eventType: 'LAST_SEEN_UPDATE',
                userId,
                timestamp: user.lastSeen.toISOString()
            });
            this.logger.debug(`Last seen update sent for user ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to send last seen update`, error.stack);
            // On continue malgré l'erreur RabbitMQ
        }
    }

    async create(input: CreateUserInput): Promise<User> {
        const user: User = {
            id: Date.now().toString(),
            username: input.username,
            email: input.email,
            status: UserStatus.ONLINE,
            lastSeen: new Date(),
            createdAt: new Date(),
            isAdmin: input.isAdmin,
        };

        this.users.push(user);

        try {
            // Envoi avec réponse attendue
            const response = await this.rabbitMQService.sendWithReply('user_creation', {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });

            this.logger.debug(`User creation acknowledged by service: ${response.serviceName}`);
        } catch (error) {
            this.logger.error('Failed to get creation acknowledgment', error.stack);
            // On continue quand même la création locale
        }

        return user;
    }

    async validateUserOnAuthService(email: string, password: string): Promise<User> {
        try {
            const authResponse = await this.rabbitMQService.sendWithReply('auth_validate', {
                email,
                password
            }, 5000); // Timeout plus court pour l'authentification

            if (!authResponse.valid) {
                throw new Error('INVALID_CREDENTIALS');
            }

            return this.findUserByEmail(email);
        } catch (error) {
            this.logger.error(`Auth validation failed for ${email}`, error.stack);
            throw error;
        }
    }

    // ... (autres méthodes inchangées)
    async findAll(): Promise<User[]> {
        return this.users;
    }

    public async findUserById(userId: string): Promise<User> {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }

    async refreshUserData(user: User): Promise<User> {
        return this.findUserById(user.id);
    }

    async findPublicProfile(userId: string): Promise<PublicUser> {
        const user = await this.findUserById(userId);
        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt
        };
    }

    public async findUserByEmail(userEmail: string): Promise<User> {
        const user = this.users.find(u => u.email === userEmail);
        if (!user) {
            throw new NotFoundException(`User with email ${userEmail} not found`);
        }
        return user;
    }
}