import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PubSub} from 'graphql-subscriptions';
import {CreateUserInput} from "../dto/create-user.input";
import {User} from "../models/user.model";
import {UserStatus} from "../enums/user-status.enum";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom, timeout} from "rxjs";
import {PublicUser} from "../models/public-user.model";

const pubSub = new PubSub();

@Injectable()
export class UsersService {
    constructor(
        @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
    ) {
    }
    private readonly logger = new Logger(UsersService.name); // Initialisation du logger
    private readonly users: User[] = []; // En vrai, utilisez TypeORM/Mongoose

    async updateLastSeen(userId: string): Promise<void> {
        const updateEvent = {
            userId,
            lastLogin: new Date().toISOString(),
            eventTime: new Date().toISOString() // Bonus : timestamp supplémentaire
        };

        try {
            await lastValueFrom(
                this.rabbitClient.emit('user_updates', updateEvent).pipe(
                    timeout(5000) // Timeout après 5s
                ));
            this.logger.log(`Last seen updated for ${userId}`); // Bonus : logging
        } catch (error) {
            this.logger.error(`Failed to update last seen for ${userId}`, error.stack);
            throw new Error('USER_UPDATE_FAILED');
        }
    }

    async create(input: CreateUserInput): Promise<User> {
        const user: User = {
            id: Date.now().toString(),
            username: input.username,
            email: input.email, // Implémentez cette méthode
            status: UserStatus.ONLINE,
            lastSeen: new Date(),
            createdAt: new Date(),
            isAdmin: input.isAdmin,
        };

        this.users.push(user);
        return user;
    }

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

    async findPublicProfile(userId: string): Promise<PublicUser> {
        const user = this.users.find(u => u.id === userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Convertit User en PublicUser
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
            throw new NotFoundException(`User with ID ${userEmail} not found`);
        }
        return user;
    }

    async refreshUserData(user: User): Promise<User> {
        return this.findUserById(user.id);
    }

    async validate(id: string): Promise<User> {
        return this.findUserById(id);
    }

    // ... autres méthodes
}