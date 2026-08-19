import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const salt = await bcrypt.genSalt(10);

  const users = [
    {
      email: 'admin@moneytracker.com',
      password: await bcrypt.hash('admin123', salt),
      name: 'Administrador'
    },
    {
      email: 'demo@moneytracker.com',
      password: await bcrypt.hash('demo123', salt),
      name: 'Usuario Demo'
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }

  console.log('Usuarios creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
