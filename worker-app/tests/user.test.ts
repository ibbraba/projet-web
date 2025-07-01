import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User CRUD', () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: 'securepass',
        name: 'Doe',
        firstName: 'John',
        mail: 'john.doe@example.com',
        phone: '1234567890',
      },
    });

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('testuser');
  });

  it('should read a user', async () => {
    const user = await prisma.user.findUnique({
      where: { username: 'testuser' },
    });

    expect(user).not.toBeNull();
    expect(user?.mail).toBe('john.doe@example.com');
  });

  it('should update a user', async () => {
    const updated = await prisma.user.update({
      where: { username: 'testuser' },
      data: { phone: '0987654321' },
    });

    expect(updated.phone).toBe('0987654321');
  });

  it('should delete a user', async () => {
    const deleted = await prisma.user.delete({
      where: { username: 'testuser' },
    });

    expect(deleted.username).toBe('testuser');
  });
});
