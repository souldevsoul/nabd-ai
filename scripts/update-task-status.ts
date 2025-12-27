import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Find the first PENDING assignment for demo@vertex.ai
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@vertex.ai' },
  })

  if (!demoUser) {
    console.error('Demo user not found')
    return
  }

  console.log('Found demo user:', demoUser.id)

  // Get a PENDING assignment for this user
  const pendingAssignment = await prisma.taskAssignment.findFirst({
    where: {
      request: { userId: demoUser.id },
      status: 'PENDING',
    },
    include: {
      specialist: { select: { firstName: true } },
    },
  })

  if (!pendingAssignment) {
    console.log('No pending assignments found')
    return
  }

  console.log('Found pending assignment:', pendingAssignment.id)
  console.log('Specialist:', pendingAssignment.specialist.firstName)

  // Update to IN_PROGRESS
  const updated = await prisma.taskAssignment.update({
    where: { id: pendingAssignment.id },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    },
  })

  console.log('Updated assignment to IN_PROGRESS:', updated.id)
  console.log('Status:', updated.status)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
