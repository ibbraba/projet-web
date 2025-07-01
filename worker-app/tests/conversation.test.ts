import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Conversation & ConversationParticipant', () => {
  let user1: any;
  let user2: any;
  let conversation: any;

  beforeAll(async () => {
    // Clear previous test data
    await prisma.conversationParticipant.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    user1 = await prisma.user.create({
      data: {
        username: 'alice',
        password: 'pass123',
        name: 'Doe',
        firstName: 'Alice',
        mail: 'alice@example.com',
        phone: '1234567890',
      },
    });

    user2 = await prisma.user.create({
      data: {
        username: 'bob',
        password: 'pass123',
        name: 'Smith',
        firstName: 'Bob',
        mail: 'bob@example.com',
        phone: '0987654321',
      },
    });
  });

  afterAll(async () => {
    await prisma.conversationParticipant.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a conversation with participants', async () => {
    conversation = await prisma.conversation.create({
      data: {
        title: 'Project Chat',
        participants: {
          create: [
            { user: { connect: { id: user1.id } } },
            { user: { connect: { id: user2.id } } },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    expect(conversation).toBeDefined();
    expect(conversation.title).toBe('Project Chat');
    expect(conversation.participants.length).toBe(2);
 //   expect(conversation.participants[0].user.username).toBe('alice' || 'bob');
  });

  it('should not allow duplicate participant in the same conversation', async () => {
    await expect(
      prisma.conversationParticipant.create({
        data: {
          userId: user1.id,
          conversationId: conversation.id,
        },
      })
    ).rejects.toThrow(/Unique constraint failed/);
  });

  it('should retrieve all conversations for a user', async () => {
    const userWithConvos = await prisma.user.findUnique({
      where: { id: user1.id },
      include: {
        conversations: {
          include: {
            conversation: true,
          },
        },
      },
    });

    expect(userWithConvos?.conversations.length).toBeGreaterThan(0);
    expect(userWithConvos?.conversations[0].conversation.title).toBe('Project Chat');
  });
});
