import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Cleaning up old @vertex.ai users...\n')

  // Find users with vertex.ai emails
  const oldUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: '@vertex.ai'
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
    }
  })

  if (oldUsers.length === 0) {
    console.log('No @vertex.ai users found.')
    return
  }

  console.log(`Found ${oldUsers.length} old users to delete:`)
  oldUsers.forEach(u => console.log(`  - ${u.email} (${u.name})`))

  // Delete wallets first (foreign key constraint)
  for (const user of oldUsers) {
    await prisma.wallet.deleteMany({
      where: { userId: user.id }
    })
  }

  // Delete the users
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@vertex.ai'
      }
    }
  })

  console.log(`\n✅ Deleted ${result.count} old @vertex.ai users`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
