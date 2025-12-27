import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('testpassword123', 10);

  console.log('Creating test buyer...');
  const buyer = await prisma.user.upsert({
    where: { email: 'test.buyer@vertex.test' },
    update: {},
    create: {
      email: 'test.buyer@vertex.test',
      name: 'Test Buyer',
      passwordHash: password,
      roles: ['BUYER'],
      emailVerified: new Date(),
    }
  });
  console.log('✅ Buyer created:', buyer.email);

  console.log('Creating test specialist...');
  const specialist = await prisma.user.upsert({
    where: { email: 'test.specialist@vertex.test' },
    update: {},
    create: {
      email: 'test.specialist@vertex.test',
      name: 'Test Specialist',
      passwordHash: password,
      roles: ['SPECIALIST'],
      emailVerified: new Date(),
    }
  });
  console.log('✅ Specialist created:', specialist.email);

  console.log('Creating test admin...');
  const admin = await prisma.user.upsert({
    where: { email: 'test.admin@vertex.test' },
    update: {},
    create: {
      email: 'test.admin@vertex.test',
      name: 'Test Admin',
      passwordHash: password,
      roles: ['ADMIN'],
      emailVerified: new Date(),
    }
  });
  console.log('✅ Admin created:', admin.email);

  console.log('\n🎉 All test users created successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: test.buyer@vertex.test');
  console.log('  Email: test.specialist@vertex.test');
  console.log('  Email: test.admin@vertex.test');
  console.log('  Password: testpassword123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
