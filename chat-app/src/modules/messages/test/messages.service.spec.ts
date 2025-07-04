import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../services/messages.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { SendMessageInput } from '../dto/send-message.input';
import { Message } from '../models/message.model';
import { MessageStatus } from '../enums/message-status.enum';

describe('MessagesService - Unit Test', () => {
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

  describe('createMessage', () => {
    it('should call rabbitMQService.sendWithReply and return a message', async () => {
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

      // Mock la réponse de sendWithReply
      (rabbitMQService.sendWithReply as jest.Mock).mockResolvedValue(mockedMessage);

      const result = await service.createMessage(input);

      // Vérifie que sendWithReply a été appelé avec les bons arguments
      expect(rabbitMQService.sendWithReply).toHaveBeenCalledWith(
        'message.queue',
        'message.response',
        'create',
        {
          content: input.content,
          senderId: input.senderId,
          conversationId: input.conversationId,
        },
      );

      // Vérifie que le résultat est bien le message mocké
      expect(result).toEqual(mockedMessage);
    });

    it('should throw an error when sendWithReply rejects', async () => {
      (rabbitMQService.sendWithReply as jest.Mock).mockRejectedValue(new Error('RabbitMQ down'));

      await expect(
        service.createMessage({
          conversationId: 'conv-123',
          content: 'Hello world',
          senderId: 'user-1',
        }),
      ).rejects.toThrow('Could not send message');
    });
  });
});
