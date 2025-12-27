import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Checking TaskMessage table...\n')

  const messages = await prisma.taskMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      sender: {
        select: { name: true, email: true },
      },
      assignment: {
        select: {
          id: true,
          status: true,
          specialist: { select: { firstName: true } },
        },
      },
    },
  })

  if (messages.length === 0) {
    console.log('No messages found in database!')
    return
  }

  console.log(`Found ${messages.length} messages:\n`)

  messages.forEach((msg, i) => {
    console.log(`Message ${i + 1}:`)
    console.log(`  ID: ${msg.id}`)
    console.log(`  Content: ${msg.content.substring(0, 50)}...`)
    console.log(`  Sender: ${msg.sender.name || msg.sender.email} (${msg.senderRole})`)
    console.log(`  Assignment: ${msg.assignment.id}`)
    console.log(`  Specialist: ${msg.assignment.specialist.firstName}`)
    console.log(`  Status: ${msg.assignment.status}`)
    console.log(`  Created: ${msg.createdAt}`)
    console.log('')
  })

  console.log('Messages verified in database!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
