import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const TEST_USERS = [
  {
    email: 'demo@vertex.ai',
    password: 'Test123!@#',
    name: 'Demo User',
    roles: ['BUYER'] as const,
    credits: 500,
  },
  {
    email: 'admin@vertex.ai',
    password: 'Admin123!@#',
    name: 'Admin User',
    roles: ['ADMIN', 'BUYER'] as const,
    credits: 1000,
  },
  {
    email: 'test@vertex.ai',
    password: 'Test123!@#',
    name: 'Test Buyer',
    roles: ['BUYER'] as const,
    credits: 250,
  },
]

async function main() {
  console.log('Seeding test users for Vertex...\n')

  for (const userData of TEST_USERS) {
    const passwordHash = await bcrypt.hash(userData.password, 12)

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        passwordHash,
        roles: [...userData.roles],
      },
      create: {
        email: userData.email,
        name: userData.name,
        passwordHash,
        roles: [...userData.roles],
        emailVerified: new Date(),
      },
    })

    console.log(`✓ User: ${user.email} (${user.roles.join(', ')})`)

    // Upsert wallet with credits
    const wallet = await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {
        balance: userData.credits,
      },
      create: {
        userId: user.id,
        balance: userData.credits,
      },
    })

    console.log(`  Wallet: ${wallet.balance} credits`)
  }

  console.log('\n✅ Test users seeded successfully!')
  console.log('\nTest Credentials:')
  TEST_USERS.forEach(u => {
    console.log(`  ${u.email} / ${u.password} (${u.credits} credits)`)
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
