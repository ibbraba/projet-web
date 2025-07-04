import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { CreateUserInput } from '../dto/create-user.input';
import { UserStatus } from '../enums/user-status.enum';

describe('UsersService', () => {
  let service: UsersService;
  let rabbitMQService: Partial<Record<keyof RabbitMQService, jest.Mock>>;

  beforeEach(async () => {
    // Mock des méthodes de RabbitMQService
    rabbitMQService = {
      send: jest.fn().mockResolvedValue(undefined),
      sendWithReply: jest.fn().mockResolvedValue({ serviceName: 'MockService', valid: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: RabbitMQService, useValue: rabbitMQService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('updateLastSeen', () => {
    it('should send a last seen update message to RabbitMQ', async () => {
      // Préparer un utilisateur
      const userId = '123';
      // On ajoute un utilisateur dans le tableau interne "users"
      (service as any).users.push({
        id: userId,
        username: 'test',
        email: 'test@test.com',
        status: UserStatus.ONLINE,
        lastSeen: new Date(),
        createdAt: new Date(),
        isAdmin: false,
      });

      await service.updateLastSeen(userId);

      expect(rabbitMQService.send).toHaveBeenCalledTimes(1);
      expect(rabbitMQService.send).toHaveBeenCalledWith(
        'user_updates',
        expect.objectContaining({
          eventType: 'LAST_SEEN_UPDATE',
          userId: userId,
          timestamp: expect.any(String),
        }),
      );
    });

    it('should throw if user not found', async () => {
      await expect(service.updateLastSeen('non-existent-id')).rejects.toThrow();
      expect(rabbitMQService.send).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user and send a creation message with reply', async () => {
      const input: CreateUserInput = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
        isAdmin: false,
      };

      const user = await service.create(input);

      expect(user).toMatchObject({
        username: input.username,
        email: input.email,
        isAdmin: input.isAdmin,
      });

      expect(rabbitMQService.sendWithReply).toHaveBeenCalledTimes(1);
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
  });
});
