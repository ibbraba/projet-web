import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../services/messages.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';
import { SendMessageInput } from '../dto/send-message.input';
import { MessageStatus } from '../enums/message-status.enum';

describe('MessagesService Integration', () => {
  let service: MessagesService;

  // Mock du RabbitMQService
  const mockRabbitMQService = {
    sendWithReply: jest.fn().mockResolvedValue({
      id: 'msg-123',
      content: 'Hello integration test',
      conversation: { id: 'conv-123' },
      sender: { id: 'user-1' },
      status: MessageStatus.SENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a message via RabbitMQ and return it', async () => {
    const input: SendMessageInput = {
      content: 'Hello integration test',
      conversationId: 'conv-123',
      senderId: 'user-1',
    };

    const result = await service.createMessage(input);

    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledTimes(1);
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      'message.queue',
      'message.response',
      'create',
      {
        content: input.content,
        senderId: input.senderId,
        conversationId: input.conversationId,
      },
    );

    expect(result).toMatchObject({
      id: 'msg-123',
      content: 'Hello integration test',
      conversation: { id: 'conv-123' },
      sender: { id: 'user-1' },
      status: MessageStatus.SENT,
    });
  });

  it('should throw error when RabbitMQ send fails', async () => {
    mockRabbitMQService.sendWithReply.mockRejectedValueOnce(new Error('RabbitMQ down'));

    const input: SendMessageInput = {
      content: 'This will fail',
      conversationId: 'conv-123',
      senderId: 'user-1',
    };

    await expect(service.createMessage(input)).rejects.toThrow('Could not send message');
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledTimes(1);
  });
});
