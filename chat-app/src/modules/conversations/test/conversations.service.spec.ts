import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../services/conversations.service';
import { NotFoundException } from '@nestjs/common';

// Type local pour contourner le problème du type dans CreateConversationInput
type CreateConversationInputOverride = {
  participantIds: string[];
  title: string;
};

describe('ConversationsService', () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationsService],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  describe('create', () => {
    it('should create and return a new conversation', async () => {
      const input: CreateConversationInputOverride = {
        participantIds: ['user1', 'user2'],
        title: 'Test Conversation',
      };

      const conversation = await service.create(input as any); // cast ici pour bypasser le type

      expect(conversation).toHaveProperty('id');
      expect(conversation.participants).toEqual(input.participantIds);
      expect(conversation.title).toBe(input.title);
      expect(conversation.lastMessage).toBeNull();
      expect(conversation.unreadCount).toBe(0);
      expect(conversation.createdAt).toBeInstanceOf(Date);
      expect(conversation.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findAll', () => {
    it('should return all conversations', async () => {
      // Créer 2 conversations pour le test
      await service.create({ participantIds: ['user1'], title: 'Conv1' } as any);
      await service.create({ participantIds: ['user2'], title: 'Conv2' } as any);

      const conversations = await service.findAll();

      expect(conversations.length).toBeGreaterThanOrEqual(2);
      expect(conversations[0]).toHaveProperty('id');
      expect(conversations[1]).toHaveProperty('id');
    });
  });

  describe('findConversationById', () => {
    it('should return a conversation by id', async () => {
      const input: CreateConversationInputOverride = {
        participantIds: ['user1'],
        title: 'Conv FindById',
      };
      const created = await service.create(input as any);

      const found = await service.findConversationById(created.id);

      expect(found.id).toBe(created.id);
      expect(found.title).toBe(input.title);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      await expect(service.findConversationById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validate', () => {
    it('should return conversation if valid', async () => {
      const input: CreateConversationInputOverride = {
        participantIds: ['user1'],
        title: 'Validate Conv',
      };
      const created = await service.create(input as any);

      const valid = await service.validate(created.id);

      expect(valid.id).toBe(created.id);
    });

    it('should throw NotFoundException if invalid', async () => {
      await expect(service.validate('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
