import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient, UserRole, KycStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

// Elite Partners - Distinguished consultants for executive AI advisory
const specialists = [
  { firstName: "A.S.", avatarSeed: "alexandra-sterling", bio: "Former senior partner with 20+ years advising Fortune 50 boards on transformative AI strategy. Led digital reinvention for three Fortune 100 CEOs. Operates exclusively at the C-suite level.", skills: ["executive-ai-strategy", "business-transformation", "strategic-forecasting"], rating: 4.99, hourlyRate: 750 },
  { firstName: "J.W.", avatarSeed: "james-worthington", bio: "Ex-managing director and quantitative strategist. Architected AI-powered decision frameworks for sovereign wealth funds and institutional investors managing $500B+ in assets.", skills: ["board-level-analytics", "c-suite-decision-support", "competitive-intelligence"], rating: 4.98, hourlyRate: 725 },
  { firstName: "V.C.", avatarSeed: "victoria-cambridge", bio: "Distinguished M&A advisor to global private equity firms. Led AI due diligence for 60+ billion-dollar technology acquisitions. Former head of corporate development at a Fortune 10 company.", skills: ["ma-due-diligence", "strategic-forecasting", "competitive-intelligence"], rating: 4.97, hourlyRate: 800 },
  { firstName: "S.B.", avatarSeed: "sebastian-blackstone", bio: "Former Chief Innovation Officer of a $50B technology conglomerate. Now consulting exclusively with boards on AI-driven competitive strategy and digital transformation at organizational scale.", skills: ["c-suite-decision-support", "executive-ai-strategy", "board-level-analytics"], rating: 4.96, hourlyRate: 680 },
  { firstName: "P.A.", avatarSeed: "penelope-ashford", bio: "Elite transformation architect with unmatched expertise in organizational redesign and AI adoption. Orchestrated organization-wide transformations for five Fortune 500 organizations with flawless execution.", skills: ["business-transformation", "executive-ai-strategy", "strategic-forecasting"], rating: 4.98, hourlyRate: 710 },
  { firstName: "H.K.", avatarSeed: "harrison-kensington", bio: "Former Chief Strategy Officer at premier global consultancy. Master of AI-powered forecasting and competitive intelligence. Trusted advisor to CEOs navigating industry disruption.", skills: ["strategic-forecasting", "competitive-intelligence", "board-level-analytics"], rating: 4.99, hourlyRate: 850 },
  { firstName: "I.P.", avatarSeed: "isabella-pemberton", bio: "Senior partner emeritus with three decades shaping corporate strategy through advanced analytics. Serves on three Fortune 500 boards. Unparalleled expertise in executive AI counsel.", skills: ["executive-ai-strategy", "ma-due-diligence", "c-suite-decision-support"], rating: 4.97, hourlyRate: 690 },
  { firstName: "T.H.", avatarSeed: "theodore-harrington", bio: "Distinguished technologist and board advisor to multinational corporations. Bridges executive vision with AI implementation excellence. Led digital transformations generating $10B+ in shareholder value.", skills: ["board-level-analytics", "business-transformation", "executive-ai-strategy"], rating: 4.98, hourlyRate: 740 },
  { firstName: "A.S.", avatarSeed: "arabella-sinclair", bio: "Premier M&A strategist with elite expertise in AI asset valuation and technology integration. Advised on 40+ transactions exceeding $1B. Former investment banker and corporate development executive.", skills: ["ma-due-diligence", "competitive-intelligence", "strategic-forecasting"], rating: 4.96, hourlyRate: 770 },
  { firstName: "N.M.", avatarSeed: "nathaniel-montgomery", bio: "Decorated C-suite advisor specializing in AI-augmented executive decision-making and strategic intelligence. Serves as trusted counsel to CEOs of global market leaders across five continents.", skills: ["c-suite-decision-support", "strategic-forecasting", "board-level-analytics"], rating: 4.99, hourlyRate: 820 },
  { firstName: "C.W.", avatarSeed: "charlotte-wentworth", bio: "Visionary transformation leader with mastery in organizational redesign and change management. Orchestrated successful AI adoption for multinational corporations in 15+ countries.", skills: ["business-transformation", "executive-ai-strategy", "c-suite-decision-support"], rating: 4.95, hourlyRate: 670 },
  { firstName: "B.C.", avatarSeed: "benedict-caldwell", bio: "Elite competitive intelligence architect. Designs AI-powered market surveillance and strategic positioning systems for industry dominators. Former Director of Strategic Intelligence at premier consultancy.", skills: ["competitive-intelligence", "strategic-forecasting", "ma-due-diligence"], rating: 4.97, hourlyRate: 700 },
];

// Bespoke Services - Premium consulting engagements for executive leadership
const tasks = [
  {
    name: "executive-ai-strategy",
    displayName: "Executive AI Strategy",
    category: "C-Suite Advisory",
    description: "Exclusive board-level consulting on transformative AI adoption, competitive positioning, and organization-wide digital strategy. Reserved for Fortune 500 leadership.",
    basePrice: 8500,
    icon: "GrTechnology"
  },
  {
    name: "board-level-analytics",
    displayName: "Board-Level Analytics",
    category: "Executive Intelligence",
    description: "Sophisticated analytics frameworks and executive intelligence systems for data-driven board governance and strategic oversight at the highest echelons.",
    basePrice: 7500,
    icon: "GrAnalytics"
  },
  {
    name: "ma-due-diligence",
    displayName: "M&A Due Diligence",
    category: "Corporate Development",
    description: "Elite AI-powered merger and acquisition intelligence. Technology asset valuation, integration risk modeling, and synergy analysis for billion-dollar transactions.",
    basePrice: 12000,
    icon: "GrDocumentStore"
  },
  {
    name: "c-suite-decision-support",
    displayName: "C-Suite Decision Support",
    category: "Executive Intelligence",
    description: "Bespoke predictive intelligence and decision support systems architected exclusively for executive leadership teams navigating complex strategic challenges.",
    basePrice: 9500,
    icon: "GrDashboard"
  },
  {
    name: "business-transformation",
    displayName: "Business Transformation",
    category: "Organizational Change",
    description: "Comprehensive digital transformation strategy and execution. Organizational redesign, change management, and AI-driven operational excellence for global organizations.",
    basePrice: 15000,
    icon: "GrConfigure"
  },
  {
    name: "strategic-forecasting",
    displayName: "Strategic Forecasting",
    category: "Predictive Intelligence",
    description: "Advanced scenario modeling, market forecasting, and AI-augmented strategic planning. Create sustained competitive advantage through predictive intelligence.",
    basePrice: 10500,
    icon: "GrChart"
  },
  {
    name: "competitive-intelligence",
    displayName: "Competitive Intelligence",
    category: "Market Strategy",
    description: "Sophisticated AI-powered competitive surveillance, market positioning analysis, and strategic threat assessment for industry leaders seeking dominance.",
    basePrice: 8000,
    icon: "GrView"
  },
];

async function main() {
  console.log("\n👑 Starting Vertex Elite seed...\n");

  // Create admin user
  console.log("Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vertex.ai" },
    update: {},
    create: {
      email: "admin@vertex.ai",
      name: "Admin User",
      passwordHash: adminPassword,
      roles: [UserRole.ADMIN, UserRole.BUYER],
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ Admin created: ${admin.email}`);

  // Create demo buyer with starter credits
  console.log("\nCreating demo buyer...");
  const buyerPassword = await bcrypt.hash("buyer123456", 12);
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@vertex.ai" },
    update: {},
    create: {
      email: "buyer@vertex.ai",
      name: "Demo Buyer",
      passwordHash: buyerPassword,
      roles: [UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  // Create wallet with starter credits for demo buyer
  await prisma.wallet.upsert({
    where: { userId: buyer.id },
    update: {},
    create: {
      userId: buyer.id,
      balance: 1000, // 1000 credits to test purchases
    },
  });
  console.log(`  ✓ Buyer created: ${buyer.email} (1000 starter credits)`);

  // Create test user with 500 credits
  console.log("\nCreating test user...");
  const testPassword = await bcrypt.hash("testpassword123", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: testPassword,
      roles: [UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  // Create wallet with 500 credits for test user
  await prisma.wallet.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      balance: 500, // 500 credits for testing
    },
  });
  console.log(`  ✓ Test user created: ${testUser.email} (500 credits)`);

  // Create executor test user
  console.log("\nCreating executor test user...");
  const executorPassword = await bcrypt.hash("testpassword123", 12);
  const executorUser = await prisma.user.upsert({
    where: { email: "executor@example.com" },
    update: {},
    create: {
      email: "executor@example.com",
      name: "Test Executor",
      passwordHash: executorPassword,
      roles: [UserRole.BUYER, UserRole.SPECIALIST],
      emailVerified: new Date(),
    },
  });

  // Create wallet for executor
  await prisma.wallet.upsert({
    where: { userId: executorUser.id },
    update: {},
    create: {
      userId: executorUser.id,
      balance: 0,
    },
  });

  // Create specialist profile for executor
  const executorSpecialist = await prisma.specialist.upsert({
    where: { userId: executorUser.id },
    update: {},
    create: {
      firstName: "Test Executor",
      avatarSeed: "executor-test",
      bio: "Test executor for automated testing",
      rating: 5.0,
      hourlyRate: 100,
      totalTasks: 0,
      completedTasks: 0,
      userId: executorUser.id,
    },
  });
  console.log(`  ✓ Executor created: ${executorUser.email}`);

  // Create admin test user
  console.log("\nCreating admin test user...");
  const adminTestPassword = await bcrypt.hash("testpassword123", 12);
  const adminTestUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Test Admin",
      passwordHash: adminTestPassword,
      roles: [UserRole.ADMIN, UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  // Create wallet for admin test user
  await prisma.wallet.upsert({
    where: { userId: adminTestUser.id },
    update: {},
    create: {
      userId: adminTestUser.id,
      balance: 1000,
    },
  });
  console.log(`  ✓ Admin test user created: ${adminTestUser.email}`);

  // Create tasks
  console.log("\nCreating AI tasks...");
  const taskMap = new Map<string, string>();
  for (const task of tasks) {
    const createdTask = await prisma.task.upsert({
      where: { name: task.name },
      update: {
        displayName: task.displayName,
        description: task.description,
        category: task.category,
        basePrice: task.basePrice,
      },
      create: {
        name: task.name,
        displayName: task.displayName,
        description: task.description,
        category: task.category,
        basePrice: task.basePrice,
      },
    });
    taskMap.set(task.name, createdTask.id);
  }
  console.log(`  ✓ Created ${tasks.length} tasks`);

  // Create specialists
  console.log("\nCreating AI specialists...");
  for (const specialist of specialists) {
    // Check if specialist already exists by avatarSeed
    let createdSpecialist = await prisma.specialist.findFirst({
      where: { avatarSeed: specialist.avatarSeed },
    });

    if (!createdSpecialist) {
      createdSpecialist = await prisma.specialist.create({
        data: {
          firstName: specialist.firstName,
          avatarSeed: specialist.avatarSeed,
          bio: specialist.bio,
          rating: specialist.rating,
          hourlyRate: specialist.hourlyRate,
          totalTasks: Math.floor(Math.random() * 50) + 10,
          completedTasks: Math.floor(Math.random() * 40) + 5,
        },
      });
    }

    // Connect specialist to their tasks
    for (const skillName of specialist.skills) {
      const taskId = taskMap.get(skillName);
      if (taskId) {
        await prisma.specialistTask.upsert({
          where: {
            specialistId_taskId: {
              specialistId: createdSpecialist.id,
              taskId,
            },
          },
          update: {},
          create: {
            specialistId: createdSpecialist.id,
            taskId,
            proficiency: 0.7 + Math.random() * 0.3,
          },
        });
      }
    }
    console.log(`  ✓ Specialist created: ${specialist.firstName}`);
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  Vertex Elite Seed Complete!            ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log("Executive Access:");
  console.log("  Admin: admin@vertex.ai / admin123456");
  console.log("  Member: buyer@vertex.ai / buyer123456 (1000 credits)");
  console.log("\nTest Users (for automated testing):");
  console.log("  Test: test@example.com / testpassword123 (500 credits)");
  console.log("  Executor: executor@example.com / testpassword123");
  console.log("  Admin: admin@example.com / testpassword123 (1000 credits)");
  console.log(`\nElite Partners: ${specialists.length} distinguished consultants with ${tasks.length} bespoke services\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
