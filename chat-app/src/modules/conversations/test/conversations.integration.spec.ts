import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationInput } from '../dto/create-conversation.input';
import { NotFoundException } from '@nestjs/common';

describe('ConversationsService - Integration', () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationsService],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it('should create a conversation', async () => {
    const input: CreateConversationInput = {
      participantIds: ['user1', 'user2'],
      title: 'Test Conversation',
    };

    const conversation = await service.create(input);

    expect(conversation).toHaveProperty('id');
    expect(conversation.participantIds).toEqual(input.participantIds); // Correction ici
    expect(conversation.title).toBe(input.title);
    expect(conversation.lastMessage).toBeNull();
    expect(conversation.unreadCount).toBe(0);
    expect(conversation.createdAt).toBeInstanceOf(Date);
  });

  it('should return all conversations', async () => {
    const input: CreateConversationInput = {
      participantIds: ['user1', 'user2'],
      title: 'Another Conversation',
    };
    await service.create(input);

    const conversations = await service.findAll();
    expect(conversations.length).toBeGreaterThanOrEqual(1);
  });

  it('should find a conversation by ID', async () => {
    const input: CreateConversationInput = {
      participantIds: ['user1', 'user2'],
      title: 'Find me',
    };
    const created = await service.create(input);

    const found = await service.findConversationById(created.id);

    expect(found.id).toBe(created.id);
    expect(found.title).toBe(input.title);
  });

  it('should throw NotFoundException if conversation not found', async () => {
    await expect(service.findConversationById('nonexistent')).rejects.toThrow(NotFoundException);
  });
});
