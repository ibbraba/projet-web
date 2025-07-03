import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../services/messages.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { SendMessageInput } from '../dto/send-message.input';
import { MessageStatus } from '../enums/message-status.enum';

describe('MessagesService', () => {
  let service: MessagesService;
  let rabbitMQService: Partial<Record<keyof RabbitMQService, jest.Mock>>;

  beforeEach(async () => {
    rabbitMQService = {
      send: jest.fn().mockResolvedValue(undefined),
      sendWithReply: jest.fn().mockImplementation(async (command: string) => {
        if (command === 'message.send') {
          return {
            message: {
              id: '1',
              content: 'Test message',
              conversation: { id: 'conv1' },
              sender: { id: 'user1', name: 'User One' },
              status: MessageStatus.SENT,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        }
        if (command === 'message.findByConversation') {
          return {
            messages: [
              {
                id: '1',
                content: 'Hello',
                conversation: { id: 'conv1' },
                sender: { id: 'user1', name: 'User One' },
                status: MessageStatus.SENT,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          };
        }
        return {};
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: RabbitMQService, useValue: rabbitMQService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  describe('findMessagesByConversation', () => {
    it('should return messages for a given conversation', async () => {
      const result = await service.findMessagesByConversation('conv1');

      expect(result).toHaveLength(1);
      expect(result[0].conversation.id).toBe('conv1');
      expect(result[0].content).toBe('Hello');
    });
  });

  describe('sendMessage', () => {
    it('should create and return a message', async () => {
      const input: SendMessageInput = {
        conversationId: 'conv1',
        content: 'Test message',
        senderId: 'user1',
      };

      const message = await service.sendMessage(input);

      expect(message).toMatchObject({
        conversation: { id: input.conversationId },
        content: input.content,
        sender: { id: input.senderId },
        status: MessageStatus.SENT,
      });

      expect(rabbitMQService.send).toHaveBeenCalled();
    });
  });
});
