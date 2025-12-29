import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Helper to generate random dates in the past
function randomPastDate(daysAgo: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
  return date
}

// Helper to generate invoice numbers
function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `NBD-${year}${month}-${random}`
}

async function main() {
  console.log('\n🚀 NABD Full Seed - Loading comprehensive test data...\n')

  // ============================================
  // 1. GET EXISTING DATA
  // ============================================
  console.log('📊 Fetching existing data...')

  const users = await prisma.user.findMany({
    include: { wallet: true }
  })

  const specialists = await prisma.specialist.findMany()
  const tasks = await prisma.task.findMany()

  if (users.length === 0 || specialists.length === 0 || tasks.length === 0) {
    console.log('⚠️  Base seed not run yet. Running prisma/seed.ts first...')
    console.log('   Run: npx prisma db seed')
    return
  }

  console.log(`   Found ${users.length} users, ${specialists.length} specialists, ${tasks.length} tasks`)

  // Get demo buyer for creating orders (buyer@nabd.ai from main seed or demo@nabd.ai from test-users seed)
  const demoBuyer = users.find(u => u.email === 'buyer@nabd.ai') || users.find(u => u.email === 'demo@nabd.ai') || users.find(u => u.roles.includes('BUYER'))
  const adminUser = users.find(u => u.roles.includes('ADMIN'))

  if (!demoBuyer) {
    console.log('⚠️  No buyer found. Skipping task requests.')
    return
  }

  // ============================================
  // 2. CREATE TASK REQUESTS WITH ASSIGNMENTS
  // ============================================
  console.log('\n📋 Creating task requests and assignments...')

  const taskRequestsData = [
    {
      description: 'Need an MVP for a fitness tracking app with AI workout recommendations. Target launch in 4 weeks.',
      status: 'COMPLETED' as const,
      taskName: 'mvp-development',
    },
    {
      description: 'Looking for help with user acquisition ML model. We have 10k users and want to predict churn.',
      status: 'IN_PROGRESS' as const,
      taskName: 'user-acquisition',
    },
    {
      description: 'Building a SaaS dashboard - need real-time analytics and KPI tracking integrated.',
      status: 'IN_PROGRESS' as const,
      taskName: 'metrics-dashboard',
    },
    {
      description: 'Pitch deck needs optimization before Series A. Want AI analysis of our narrative flow.',
      status: 'MATCHED' as const,
      taskName: 'pitch-analytics',
    },
    {
      description: 'Customer support is overwhelming us. Need a chatbot that handles common questions.',
      status: 'PAID' as const,
      taskName: 'chatbot-mvp',
    },
    {
      description: 'Want to validate our marketplace idea before building. Need market analysis.',
      status: 'PENDING' as const,
      taskName: 'market-validation',
    },
    {
      description: 'Our conversion funnel is leaking. Need A/B testing setup and optimization.',
      status: 'COMPLETED' as const,
      taskName: 'conversion-optimization',
    },
    {
      description: 'Building recommendation engine for e-commerce. 50k products, need personalization.',
      status: 'IN_PROGRESS' as const,
      taskName: 'recommendation-ai',
    },
  ]

  const createdRequests: Array<{ id: string; status: string }> = []

  for (const reqData of taskRequestsData) {
    const task = tasks.find(t => t.name === reqData.taskName)
    if (!task) continue

    // Check if similar request already exists
    const existing = await prisma.taskRequest.findFirst({
      where: {
        userId: demoBuyer.id,
        description: { contains: reqData.description.substring(0, 50) }
      }
    })

    if (existing) {
      createdRequests.push({ id: existing.id, status: existing.status })
      continue
    }

    const taskRequest = await prisma.taskRequest.create({
      data: {
        userId: demoBuyer.id,
        taskId: task.id,
        description: reqData.description,
        status: reqData.status,
        totalCost: task.basePrice * (0.8 + Math.random() * 0.4),
        createdAt: randomPastDate(30),
      }
    })

    createdRequests.push({ id: taskRequest.id, status: taskRequest.status })
    console.log(`   ✓ Task request: ${reqData.taskName} (${reqData.status})`)

    // Create assignments for matched/paid/in_progress/completed requests
    if (['MATCHED', 'PAID', 'IN_PROGRESS', 'COMPLETED'].includes(reqData.status)) {
      const numAssignments = reqData.status === 'MATCHED' ? 3 : 1
      const shuffledSpecialists = [...specialists].sort(() => Math.random() - 0.5)

      for (let i = 0; i < numAssignments && i < shuffledSpecialists.length; i++) {
        const specialist = shuffledSpecialists[i]

        let assignmentStatus: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'RATED' = 'PENDING'
        if (reqData.status === 'PAID') assignmentStatus = 'ACCEPTED'
        if (reqData.status === 'IN_PROGRESS') assignmentStatus = 'IN_PROGRESS'
        if (reqData.status === 'COMPLETED') assignmentStatus = 'RATED'

        // Only first assignment is accepted for PAID/IN_PROGRESS/COMPLETED
        if (i > 0 && reqData.status !== 'MATCHED') continue

        const assignment = await prisma.taskAssignment.create({
          data: {
            requestId: taskRequest.id,
            specialistId: specialist.id,
            status: assignmentStatus,
            price: task.basePrice * (0.9 + Math.random() * 0.2),
            confidence: 0.75 + Math.random() * 0.25,
            reasoning: `${specialist.firstName} has strong expertise in ${task.displayName} with ${specialist.completedTasks} completed projects.`,
            rating: assignmentStatus === 'RATED' ? 4.5 + Math.random() * 0.5 : null,
            feedback: assignmentStatus === 'RATED' ? 'Excellent work! Delivered on time and exceeded expectations.' : null,
            startedAt: ['IN_PROGRESS', 'COMPLETED', 'RATED'].includes(assignmentStatus) ? randomPastDate(14) : null,
            completedAt: ['COMPLETED', 'RATED'].includes(assignmentStatus) ? randomPastDate(3) : null,
          }
        })

        // Create messages for in-progress and completed assignments
        if (['IN_PROGRESS', 'COMPLETED', 'RATED'].includes(assignmentStatus)) {
          const messages = [
            { senderRole: 'BUYER', content: `Hi ${specialist.firstName}! Excited to work with you on this project.` },
            { senderRole: 'SPECIALIST', content: `Thanks for choosing me! I've reviewed your requirements and have a few clarifying questions.` },
            { senderRole: 'SPECIALIST', content: `What's your preferred tech stack? And do you have any existing codebase I should integrate with?` },
            { senderRole: 'BUYER', content: `We're using Next.js + Python for the backend. No existing code yet, starting fresh.` },
            { senderRole: 'SPECIALIST', content: `Perfect! I'll start with the architecture today. Expect first deliverable by end of week.` },
          ]

          if (assignmentStatus === 'RATED') {
            messages.push(
              { senderRole: 'SPECIALIST', content: `Just pushed the final version. All features implemented and tested. Let me know if you need any adjustments!` },
              { senderRole: 'BUYER', content: `This is fantastic work! Everything works perfectly. Thank you so much!` }
            )
          }

          for (let j = 0; j < messages.length; j++) {
            await prisma.taskMessage.create({
              data: {
                assignmentId: assignment.id,
                senderId: messages[j].senderRole === 'BUYER' ? demoBuyer.id : (adminUser?.id || demoBuyer.id),
                senderRole: messages[j].senderRole,
                content: messages[j].content,
                createdAt: new Date(Date.now() - (messages.length - j) * 3600000), // 1 hour apart
              }
            })
          }
          console.log(`      + ${messages.length} messages added`)
        }
      }
    }
  }

  // ============================================
  // 3. CREATE INVOICES & TRANSACTIONS
  // ============================================
  console.log('\n💳 Creating invoices and credit transactions...')

  const invoicesData = [
    { amount: 10, credits: 100, status: 'PAID' as const, daysAgo: 45 },
    { amount: 50, credits: 500, status: 'PAID' as const, daysAgo: 30 },
    { amount: 100, credits: 1000, status: 'PAID' as const, daysAgo: 14 },
    { amount: 200, credits: 2000, status: 'PAID' as const, daysAgo: 7 },
    { amount: 50, credits: 500, status: 'PAID' as const, daysAgo: 3 },
    { amount: 100, credits: 1000, status: 'PENDING' as const, daysAgo: 0 },
    { amount: 25, credits: 250, status: 'FAILED' as const, daysAgo: 5 },
  ]

  let runningBalance = 0
  const wallet = demoBuyer.wallet

  if (wallet) {
    // Check if invoices already exist
    const existingInvoices = await prisma.invoice.count({
      where: { userId: demoBuyer.id }
    })

    if (existingInvoices === 0) {
      for (const invData of invoicesData) {
        const createdAt = new Date()
        createdAt.setDate(createdAt.getDate() - invData.daysAgo)

        const invoice = await prisma.invoice.create({
          data: {
            userId: demoBuyer.id,
            invoiceNumber: generateInvoiceNumber(),
            amount: invData.amount,
            creditsAmount: invData.credits,
            currency: 'EUR',
            status: invData.status,
            paidAt: invData.status === 'PAID' ? createdAt : null,
            createdAt,
          }
        })

        console.log(`   ✓ Invoice ${invoice.invoiceNumber}: ${invData.amount} EUR (${invData.status})`)

        if (invData.status === 'PAID') {
          runningBalance += invData.credits

          await prisma.creditTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT_PURCHASE',
              amount: invData.credits,
              balance: runningBalance,
              description: `Purchased ${invData.credits} credits`,
              invoiceId: invoice.id,
              createdAt,
            }
          })
        }
      }

      // Add some spending transactions
      const spendingData = [
        { amount: -600, description: 'MVP Development - Fitness App', daysAgo: 25 },
        { amount: -450, description: 'Pitch Deck Analysis', daysAgo: 18 },
        { amount: -300, description: 'Market Validation Report', daysAgo: 10 },
        { amount: -500, description: 'Analytics Dashboard Setup', daysAgo: 5 },
      ]

      for (const spend of spendingData) {
        runningBalance += spend.amount
        const createdAt = new Date()
        createdAt.setDate(createdAt.getDate() - spend.daysAgo)

        await prisma.creditTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'PHOTO_PURCHASE', // Using this for task purchases
            amount: spend.amount,
            balance: runningBalance,
            description: spend.description,
            createdAt,
          }
        })
        console.log(`   ✓ Transaction: ${spend.description} (${spend.amount} credits)`)
      }

      // Update wallet balance
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: runningBalance > 0 ? runningBalance : 500,
          totalSpent: Math.abs(spendingData.reduce((sum, s) => sum + s.amount, 0))
        }
      })
    } else {
      console.log(`   (Invoices already exist, skipping)`)
    }
  }

  // ============================================
  // 4. UPDATE SPECIALIST STATS
  // ============================================
  console.log('\n📈 Updating specialist statistics...')

  for (const specialist of specialists) {
    const completedAssignments = await prisma.taskAssignment.count({
      where: {
        specialistId: specialist.id,
        status: { in: ['COMPLETED', 'RATED'] }
      }
    })

    const totalAssignments = await prisma.taskAssignment.count({
      where: { specialistId: specialist.id }
    })

    await prisma.specialist.update({
      where: { id: specialist.id },
      data: {
        completedTasks: specialist.completedTasks + completedAssignments,
        totalTasks: specialist.totalTasks + totalAssignments,
      }
    })
  }
  console.log(`   ✓ Updated ${specialists.length} specialists`)

  // ============================================
  // SUMMARY
  // ============================================
  const stats = {
    taskRequests: await prisma.taskRequest.count(),
    assignments: await prisma.taskAssignment.count(),
    messages: await prisma.taskMessage.count(),
    invoices: await prisma.invoice.count(),
    transactions: await prisma.creditTransaction.count(),
  }

  console.log('\n╔═══════════════════════════════════════════════════════╗')
  console.log('║     🚀 NABD FULL SEED COMPLETE! 🚀              ║')
  console.log('╠═══════════════════════════════════════════════════════╣')
  console.log(`║  Task Requests:    ${String(stats.taskRequests).padStart(4)}                            ║`)
  console.log(`║  Assignments:      ${String(stats.assignments).padStart(4)}                            ║`)
  console.log(`║  Messages:         ${String(stats.messages).padStart(4)}                            ║`)
  console.log(`║  Invoices:         ${String(stats.invoices).padStart(4)}                            ║`)
  console.log(`║  Transactions:     ${String(stats.transactions).padStart(4)}                            ║`)
  console.log('╚═══════════════════════════════════════════════════════╝\n')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
