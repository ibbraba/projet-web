import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../services/conversations.service';
import { RabbitMQService } from '../../../core/rabbitmq/rabbitmq.service';

describe('ConversationsService - Integration', () => {
  let service: ConversationsService;

  // Mock du RabbitMQService avec les méthodes utilisées dans ConversationsService
  const mockRabbitMQService = {
    sendWithReply: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // nettoie les mocks après chaque test
  });

  it('should create a conversation', async () => {
    const mockConversation = { id: '123', title: 'Test conversation', participantIds: ['1', '2'] };
    mockRabbitMQService.sendWithReply.mockResolvedValueOnce(mockConversation);

    const result = await service.create({ participantIds: ['1', '2'], title: 'Test conversation' });

    expect(result).toEqual(mockConversation);
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      service.conversationQueue,
      service.conversationReplyQueue,
      'create',
      expect.any(Object),
    );
  });

  it('should find all conversations', async () => {
    const mockConversations = [
      { id: '1', title: 'Conversation 1', participantIds: ['1', '2'] },
      { id: '2', title: 'Conversation 2', participantIds: ['3', '4'] },
    ];
    mockRabbitMQService.sendWithReply.mockResolvedValueOnce(mockConversations);

    const result = await service.findAll();

    expect(result).toEqual(mockConversations);
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      service.conversationQueue,
      service.conversationReplyQueue,
      'findAll',
      { data: {} },
    );
  });

  it('should find user conversations', async () => {
    const userId = 'user-123';
    const mockUserConversations = [
      { id: '1', title: 'Conversation 1', participantIds: ['user-123', '2'] },
    ];
    mockRabbitMQService.sendWithReply.mockResolvedValueOnce(mockUserConversations);

    const result = await service.findUserConversations(userId);

    expect(result).toEqual(mockUserConversations);
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      service.conversationQueue,
      service.conversationReplyQueue,
      'findUserConversations',
      { userId },
    );
  });

  it('should update a conversation', async () => {
    const conversationId = '123';
    const newTitle = 'Updated title';
    const mockUpdatedConversation = { id: conversationId, title: newTitle, participantIds: ['1', '2'] };

    mockRabbitMQService.sendWithReply.mockResolvedValueOnce(mockUpdatedConversation);

    const result = await service.update(conversationId, newTitle);

    expect(result).toEqual(mockUpdatedConversation);
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      service.conversationQueue,
      service.conversationReplyQueue,
      'update',
      { id: conversationId, title: newTitle },
    );
  });

  it('should remove a conversation', async () => {
    const conversationId = '123';
    mockRabbitMQService.sendWithReply.mockResolvedValueOnce({ deleted: true });

    const result = await service.remove(conversationId);

    expect(result).toEqual({ deleted: true });
    expect(mockRabbitMQService.sendWithReply).toHaveBeenCalledWith(
      service.conversationQueue,
      service.conversationReplyQueue,
      'remove',
      { id: conversationId },
    );
  });
});
