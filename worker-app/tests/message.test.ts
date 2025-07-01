import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Message model (Prisma)', () => {
  let user: any;
  let conversation: any;

  beforeAll(async () => {
    // Clean DB
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();

    // Create a user
    user = await prisma.user.create({
      data: {
        username: 'test_user',
        password: 'securepassword',
        name: 'Doe',
        firstName: 'John',
        mail: 'john.doe@example.com',
        phone: '1234567890',
      },
    });

    // Create a conversation
    conversation = await prisma.conversation.create({
      data: {
        title: 'Test Conversation',
        participants: {
          create: {
            user: {
              connect: { id: user.id },
            },
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a message', async () => {
    const message = await prisma.message.create({
      data: {
        content: 'Hello world!',
        senderId: user.id,
        conversationId: conversation.id,
      },
    });

    expect(message).toHaveProperty('id');
    expect(message.content).toBe('Hello world!');
    expect(message.senderId).toBe(user.id);
    expect(message.conversationId).toBe(conversation.id);
  });

  it('should fetch messages in a conversation', async () => {
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
    });

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].conversationId).toBe(conversation.id);
  });
});
