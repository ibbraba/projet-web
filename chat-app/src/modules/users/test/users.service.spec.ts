import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { CreateUserInput } from '../dto/create-user.input';
import { UserStatus } from '../enums/user-status.enum';

describe('UsersService', () => {
  let service: UsersService;
  let rabbitMQService: {
    sendWithReply: jest.Mock;
  };

  const fakeUser = {
    id: '123',
    username: 'newuser',
    mail: 'newuser@test.com',
    status: UserStatus.ONLINE,
    lastSeen: new Date(),
    createdAt: new Date(),
    isAdmin: false,
  };

  beforeEach(async () => {
    rabbitMQService = {
      sendWithReply: jest.fn().mockResolvedValue(fakeUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: RabbitMQService, useValue: rabbitMQService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and send a creation message with reply', async () => {
      const input: CreateUserInput = {
        username: 'newuser',
        mail: 'newuser@test.com',
        password: 'password123',
        firstName: undefined,
        name: undefined,
        phone: undefined,
      };

      const user = await service.create(input);

      expect(user).toMatchObject({
        id: '123',
        username: input.username,
        mail: input.mail,
      });

      expect(rabbitMQService.sendWithReply).toHaveBeenCalledTimes(1);
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
  });
});
