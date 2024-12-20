// createAdmin.ts (with require instead of import)
const { PrismaClient } = require('@prisma/client'); // Using require

const prisma = new PrismaClient();

async function createAdmin() {
  const admin = await prisma.admin.create({
    data: {
      name: 'Paul', // Replace this with the actual admin name
    },
  });
  console.log('Admin created:', admin);
}

createAdmin().catch((e) => {
  throw e;
}).finally(async () => {
  await prisma.$disconnect();
});
