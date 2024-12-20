import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleUsers() {
  // Create Admins
  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin 1',
      email: 'admin1@example.com',
      password: 'adminpass123',  // Make sure to hash the password in production
      role: 'admin',             // Assign admin role
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'Admin 2',
      email: 'admin2@example.com',
      password: 'adminpass123',  // Make sure to hash the password in production
      role: 'admin',             // Assign admin role
    },
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@example.com',
      password: 'userpass123',   // Make sure to hash the password in production
      role: 'user',              // Assign user role
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@example.com',
      password: 'userpass123',   // Make sure to hash the password in production
      role: 'user',              // Assign user role
    },
  });

  console.log('Admins and Users created:', { admin1, admin2, user1, user2 });
}

createSampleUsers()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
