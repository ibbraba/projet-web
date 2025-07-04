import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { CreateUserInput } from '../dto/create-user.input';
import { UserStatus } from '../enums/user-status.enum';

describe('UsersService Integration', () => {
  let usersService: UsersService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RabbitMQService,
          useValue: {
            send: jest.fn().mockResolvedValue(undefined),
            sendWithReply: jest.fn().mockResolvedValue({ serviceName: 'MockService', valid: true }),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should create a user and send creation message', async () => {
    const input: CreateUserInput = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      isAdmin: false,
    };

    const user = await usersService.create(input);

    expect(user).toHaveProperty('id');
    expect(user.username).toBe(input.username);
    expect(user.email).toBe(input.email);
    expect(user.status).toBe(UserStatus.ONLINE);
    expect(rabbitMQService.sendWithReply).toHaveBeenCalledWith(
      'user_creation',
      expect.objectContaining({
        user: expect.objectContaining({
          id: user.id,
          username: user.username,
          email: user.email,
        }),
      }),
    );
  });

  it('should update lastSeen and send last seen update', async () => {
    const input: CreateUserInput = {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      isAdmin: false,
    };
    const user = await usersService.create(input);

    await usersService.updateLastSeen(user.id);

    // Vérifier que send est appelé avec le bon event
    expect(rabbitMQService.send).toHaveBeenCalledWith(
      'user_updates',
      expect.objectContaining({
        eventType: 'LAST_SEEN_UPDATE',
        userId: user.id,
        timestamp: expect.any(String),
      }),
    );

    // Vérifier que lastSeen est mis à jour dans l'utilisateur
    const updatedUser = await usersService.findUserById(user.id);
    expect(updatedUser.lastSeen).toBeInstanceOf(Date);
    expect(updatedUser.lastSeen.getTime()).toBeGreaterThanOrEqual(user.createdAt.getTime());
  });

  it('should throw NotFoundException when user not found', async () => {
    await expect(usersService.findUserById('nonexistent')).rejects.toThrow('User with ID nonexistent not found');
  });
});
