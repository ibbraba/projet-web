import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { CreateUserInput } from '../dto/create-user.input';
import { NotFoundException } from '@nestjs/common';
import { User } from '../models/user.model';

describe('UsersService Integration', () => {
  let usersService: UsersService;
  let rabbitMQService: RabbitMQService;

  const fakeUser: User = {
    id: '123',
    username: 'testuser',
    mail: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    name: 'Test',
    firstName: 'User',
    phone: '0123456789',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RabbitMQService,
          useValue: {
            send: jest.fn().mockResolvedValue(undefined),
            sendWithReply: jest.fn().mockResolvedValue(fakeUser),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);

    jest.spyOn(usersService, 'findUserById').mockImplementation(async (id: string) => {
      if (id === 'nonexistent') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return {
        ...fakeUser,
        id,
      };
    });
  });

  it('should create a user and send creation message', async () => {
    const input: CreateUserInput = {
      username: 'testuser',
      mail: 'test@example.com',
      password: 'password123',
    };

    const user = await usersService.create(input);

    expect(user).toHaveProperty('id');
    expect(user.username).toBe(input.username);
    expect(user.mail).toBe(input.mail);

    expect(rabbitMQService.sendWithReply).toHaveBeenCalledWith(
      'user.queue',
      'user.response',
      'create',
      expect.objectContaining({
        username: input.username,
        mail: input.mail,
      }),
    );
  });

  it('should throw NotFoundException when user not found', async () => {
    await expect(usersService.findUserById('nonexistent')).rejects.toThrow('User with ID nonexistent not found');
  });
});
