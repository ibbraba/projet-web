import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../services/messages.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { SendMessageInput } from '../dto/send-message.input';
import { Message } from '../models/message.model';
import { MessageStatus } from '../enums/message-status.enum';

describe('MessagesService - Integration Test', () => {
  let service: MessagesService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: RabbitMQService,
          useValue: {
            sendWithReply: jest.fn(),
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  describe('sendMessage', () => {
    it('should send a message and publish the created event', async () => {
      const input: SendMessageInput = {
        conversationId: 'conv-123',
        content: 'Hello world',
        senderId: 'user-1',
      };

      const mockedMessage: Message = {
        id: 'msg-1',
        content: input.content,
        sender: { id: input.senderId, username: 'User1' } as any,
        conversation: { id: input.conversationId } as any,
        status: MessageStatus.SENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (rabbitMQService.sendWithReply as jest.Mock).mockResolvedValue({
        message: mockedMessage,
      });

      (rabbitMQService.send as jest.Mock).mockResolvedValue(undefined);

      const result = await service.sendMessage(input);

      expect(rabbitMQService.sendWithReply).toHaveBeenCalledWith('message.send', {
        content: input.content,
        senderId: input.senderId,
        conversationId: input.conversationId,
      });

      expect(rabbitMQService.send).toHaveBeenCalledWith('message.created', {
        event: 'MESSAGE_CREATED',
        data: {
          messageCreated: mockedMessage,
        },
      });

      expect(result).toEqual(mockedMessage);
    });

    it('should throw error if sending fails', async () => {
      (rabbitMQService.sendWithReply as jest.Mock).mockRejectedValue(new Error('RabbitMQ down'));

      await expect(
        service.sendMessage({
          conversationId: 'conv-123',
          content: 'Hello',
          senderId: 'user-1',
        }),
      ).rejects.toThrow('Could not send message');
    });
  });

  describe('findMessagesByConversation', () => {
    it('should find messages by conversation', async () => {
      const mockedMessages: Message[] = [
        {
          id: 'msg-1',
          content: 'First message',
          sender: { id: 'user-1' } as any,
          conversation: { id: 'conv-123' } as any,
          status: MessageStatus.DELIVERED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (rabbitMQService.sendWithReply as jest.Mock).mockResolvedValue({
        messages: mockedMessages,
      });

      const result = await service.findMessagesByConversation('conv-123', 10);

      expect(rabbitMQService.sendWithReply).toHaveBeenCalledWith('message.findByConversation', {
        conversationId: 'conv-123',
        limit: 10,
      });

      expect(result).toEqual(mockedMessages);
    });

    it('should throw error if finding messages fails', async () => {
      (rabbitMQService.sendWithReply as jest.Mock).mockRejectedValue(new Error('RabbitMQ error'));

      await expect(service.findMessagesByConversation('conv-123')).rejects.toThrow('Could not retrieve messages');
    });
  });
});
