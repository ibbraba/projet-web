// src/users/mocks/users.service.mock.ts
import {Injectable} from '@nestjs/common';
import {User} from '../models/user.model';
import {UserStatus} from "../enums/user-status.enum";

@Injectable()
export class MockUsersService {
    private users: User[] = [
        { id: '1', username: 'Mock User', mail: 'mock@test.com', createdAt: new Date(), name: 'Mock User', firstName: 'Mock', phone: '123456789'},
    ];

    findAll() {
        return Promise.resolve(this.users);
    }

    findById(id: string) {
        return Promise.resolve(this.users.find(u => u.id === id));
    }
}