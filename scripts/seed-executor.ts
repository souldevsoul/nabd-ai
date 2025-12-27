import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Creating executor test user...\n')

  // Create executor user
  const passwordHash = await bcrypt.hash('Executor123!@#', 12)

  const user = await prisma.user.upsert({
    where: { email: 'executor@vertex.ai' },
    update: {
      name: 'Alex (Executor)',
      passwordHash,
      roles: ['SPECIALIST', 'BUYER'],
    },
    create: {
      email: 'executor@vertex.ai',
      name: 'Alex (Executor)',
      passwordHash,
      roles: ['SPECIALIST', 'BUYER'],
      emailVerified: new Date(),
    },
  })

  console.log(`✓ User: ${user.email} (${user.roles.join(', ')})`)

  // Create wallet
  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: { balance: 0 },
    create: {
      userId: user.id,
      balance: 0,
      totalEarnings: 850, // Simulated earnings
    },
  })

  // Find the "Alex" specialist and link to user
  const specialist = await prisma.specialist.findFirst({
    where: { firstName: 'Alex' },
  })

  if (specialist) {
    await prisma.specialist.update({
      where: { id: specialist.id },
      data: { userId: user.id },
    })
    console.log(`✓ Linked to specialist: ${specialist.firstName} (${specialist.id})`)
  } else {
    console.log('⚠ No specialist named Alex found')
  }

  // Get assignments for this specialist
  const assignments = await prisma.taskAssignment.count({
    where: { specialistId: specialist?.id },
  })
  console.log(`✓ Active assignments: ${assignments}`)

  console.log('\n✅ Executor setup complete!')
  console.log('\nTest Credentials:')
  console.log('  executor@vertex.ai / Executor123!@#')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
