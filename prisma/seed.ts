import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient, UserRole, KycStatus, TaskRequestStatus, AssignmentStatus } from "@prisma/client";
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

// نبض خبراء الصحة - Healthcare/Medical AI specialists (Arabic - Pulse/Heartbeat theme)
const specialists = [
  { firstName: "د.أ.", avatarSeed: "dr-ahmad-pulse", bio: "طبيب وباحث في الذكاء الاصطناعي الطبي مع 20+ سنة خبرة. قاد تطوير أنظمة التشخيص بالذكاء الاصطناعي في مستشفيات عالمية. مستشار لمنظمة الصحة العالمية.", skills: ["diagnostic-ai", "clinical-systems", "medical-imaging"], rating: 4.99, hourlyRate: 650 },
  { firstName: "د.س.", avatarSeed: "dr-sara-cardiac", bio: "متخصصة في تحليل بيانات القلب والأوعية الدموية. طورت أنظمة ذكاء اصطناعي للكشف المبكر عن أمراض القلب. نشرت 50+ بحث علمي.", skills: ["cardiac-ai", "diagnostic-ai", "predictive-health"], rating: 4.98, hourlyRate: 580 },
  { firstName: "م.ع.", avatarSeed: "eng-ali-biotech", bio: "مهندس تقنية حيوية متخصص في تطوير أجهزة طبية ذكية. صمم أنظمة مراقبة المرضى عن بعد لمستشفيات في 30+ دولة.", skills: ["remote-monitoring", "medical-devices", "clinical-systems"], rating: 4.97, hourlyRate: 520 },
  { firstName: "د.ل.", avatarSeed: "dr-layla-radiology", bio: "أخصائية أشعة وذكاء اصطناعي. طورت نماذج للكشف عن الأورام باستخدام التصوير الطبي. دقة تشخيصية تفوق 98%.", skills: ["medical-imaging", "diagnostic-ai", "cancer-detection"], rating: 4.96, hourlyRate: 600 },
  { firstName: "د.م.", avatarSeed: "dr-mohammed-pharma", bio: "صيدلي وباحث في اكتشاف الأدوية بالذكاء الاصطناعي. عمل مع شركات أدوية عالمية. ساهم في تطوير 10+ أدوية جديدة.", skills: ["drug-discovery", "clinical-systems", "predictive-health"], rating: 4.98, hourlyRate: 700 },
  { firstName: "د.ن.", avatarSeed: "dr-nour-genomics", bio: "عالمة جينوم متخصصة في الطب الشخصي. طورت أنظمة ذكاء اصطناعي لتحليل الجينوم وتخصيص العلاج.", skills: ["genomics-ai", "personalized-medicine", "diagnostic-ai"], rating: 4.99, hourlyRate: 680 },
  { firstName: "م.ك.", avatarSeed: "eng-karim-health", bio: "مهندس نظم صحية متخصص في تكامل البيانات الطبية. صمم أنظمة سجلات طبية إلكترونية لسلاسل مستشفيات كبرى.", skills: ["clinical-systems", "health-data", "remote-monitoring"], rating: 4.97, hourlyRate: 480 },
  { firstName: "د.ف.", avatarSeed: "dr-fatima-mental", bio: "طبيبة نفسية متخصصة في الصحة النفسية الرقمية. طورت تطبيقات ذكاء اصطناعي للدعم النفسي والعلاج المعرفي.", skills: ["mental-health-ai", "predictive-health", "clinical-systems"], rating: 4.96, hourlyRate: 550 },
  { firstName: "د.ر.", avatarSeed: "dr-rami-emergency", bio: "طبيب طوارئ متخصص في أنظمة الاستجابة السريعة. صمم أنظمة ذكاء اصطناعي لتصنيف الحالات الطارئة.", skills: ["emergency-ai", "diagnostic-ai", "clinical-systems"], rating: 4.98, hourlyRate: 620 },
  { firstName: "د.ه.", avatarSeed: "dr-hana-nutrition", bio: "أخصائية تغذية وباحثة في الذكاء الاصطناعي الغذائي. طورت أنظمة توصيات غذائية شخصية.", skills: ["nutrition-ai", "personalized-medicine", "predictive-health"], rating: 4.95, hourlyRate: 450 },
  { firstName: "م.ط.", avatarSeed: "eng-tariq-wearable", bio: "مهندس أجهزة قابلة للارتداء متخصص في مراقبة العلامات الحيوية. صمم أجهزة لشركات تقنية عالمية.", skills: ["medical-devices", "remote-monitoring", "cardiac-ai"], rating: 4.97, hourlyRate: 530 },
  { firstName: "د.ي.", avatarSeed: "dr-yasser-surgical", bio: "جراح وباحث في الجراحة الروبوتية. طور أنظمة مساعدة جراحية بالذكاء الاصطناعي.", skills: ["surgical-ai", "medical-imaging", "clinical-systems"], rating: 4.96, hourlyRate: 750 },
];

// خدمات نبض الصحية - Healthcare AI services (Arabic)
const tasks = [
  {
    name: "diagnostic-ai",
    displayName: "التشخيص الذكي",
    category: "التشخيص الطبي",
    description: "أنظمة ذكاء اصطناعي للتشخيص الطبي. تحليل الأعراض، دعم القرار السريري، والكشف المبكر عن الأمراض.",
    basePrice: 6500,
  },
  {
    name: "medical-imaging",
    displayName: "التصوير الطبي الذكي",
    category: "الأشعة والتصوير",
    description: "تحليل الصور الطبية بالذكاء الاصطناعي. الأشعة السينية، الرنين المغناطيسي، والتصوير المقطعي.",
    basePrice: 7500,
  },
  {
    name: "clinical-systems",
    displayName: "الأنظمة السريرية",
    category: "إدارة المستشفيات",
    description: "أنظمة ذكية لإدارة العمليات السريرية. جدولة المواعيد، إدارة الأسرة، وتحسين سير العمل.",
    basePrice: 5000,
  },
  {
    name: "predictive-health",
    displayName: "الصحة التنبؤية",
    category: "الطب الوقائي",
    description: "نماذج ذكاء اصطناعي للتنبؤ بالمخاطر الصحية. تحليل عوامل الخطر وتوصيات الوقاية.",
    basePrice: 5500,
  },
  {
    name: "remote-monitoring",
    displayName: "المراقبة عن بعد",
    category: "الرعاية الصحية عن بعد",
    description: "أنظمة مراقبة المرضى عن بعد. تتبع العلامات الحيوية، تنبيهات ذكية، ورعاية مستمرة.",
    basePrice: 4500,
  },
  {
    name: "drug-discovery",
    displayName: "اكتشاف الأدوية",
    category: "البحث الدوائي",
    description: "ذكاء اصطناعي لاكتشاف الأدوية. تحليل الجزيئات، التنبؤ بالفعالية، وتسريع البحث.",
    basePrice: 12000,
  },
  {
    name: "cardiac-ai",
    displayName: "ذكاء القلب",
    category: "أمراض القلب",
    description: "أنظمة ذكاء اصطناعي لتحليل القلب. تخطيط القلب، عدم انتظام ضربات القلب، والتنبؤ بالمخاطر.",
    basePrice: 6000,
  },
  {
    name: "genomics-ai",
    displayName: "الجينوم الذكي",
    category: "الطب الجيني",
    description: "تحليل الجينوم بالذكاء الاصطناعي. تفسير المتغيرات الجينية وتخصيص العلاج.",
    basePrice: 8500,
  },
  {
    name: "mental-health-ai",
    displayName: "الصحة النفسية الذكية",
    category: "الطب النفسي",
    description: "أنظمة دعم الصحة النفسية. الكشف المبكر، العلاج الرقمي، والدعم المستمر.",
    basePrice: 5000,
  },
  {
    name: "personalized-medicine",
    displayName: "الطب الشخصي",
    category: "الطب الدقيق",
    description: "حلول الطب الشخصي بالذكاء الاصطناعي. تخصيص العلاج بناءً على البيانات الفردية.",
    basePrice: 7000,
  },
];

async function main() {
  console.log("\n💓 نبض - بذر منصة الصحة الذكية...\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  نبض - ذكاء الصحة الاصطناعي                ║");
  console.log("╚════════════════════════════════════════════╝\n");

  // Create admin user
  console.log("🏥 إنشاء حساب المسؤول...");
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nabd.ai" },
    update: {},
    create: {
      email: "admin@nabd.ai",
      name: "مسؤول نبض",
      passwordHash: adminPassword,
      roles: [UserRole.ADMIN, UserRole.BUYER],
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ المسؤول: ${admin.email}`);

  // Create demo buyer
  console.log("\n🏥 إنشاء المستشفى التجريبي...");
  const buyerPassword = await bcrypt.hash("buyer123456", 12);
  const buyer = await prisma.user.upsert({
    where: { email: "hospital@nabd.ai" },
    update: {},
    create: {
      email: "hospital@nabd.ai",
      name: "مستشفى نبض",
      passwordHash: buyerPassword,
      roles: [UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  await prisma.wallet.upsert({
    where: { userId: buyer.id },
    update: {},
    create: {
      userId: buyer.id,
      balance: 25000,
    },
  });
  console.log(`  ✓ المستشفى: ${buyer.email} (25000 رصيد)`);

  // Create test user
  console.log("\n🏥 إنشاء الطبيب التجريبي...");
  const testPassword = await bcrypt.hash("testpassword123", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "طبيب تجريبي",
      passwordHash: testPassword,
      roles: [UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  await prisma.wallet.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      balance: 10000,
    },
  });
  console.log(`  ✓ الطبيب التجريبي: ${testUser.email} (10000 رصيد)`);

  // Create executor
  console.log("\n🏥 إنشاء الخبير الطبي...");
  const executorPassword = await bcrypt.hash("testpassword123", 12);
  const executorUser = await prisma.user.upsert({
    where: { email: "executor@example.com" },
    update: {},
    create: {
      email: "executor@example.com",
      name: "خبير طبي",
      passwordHash: executorPassword,
      roles: [UserRole.BUYER, UserRole.SPECIALIST],
      emailVerified: new Date(),
    },
  });

  await prisma.wallet.upsert({
    where: { userId: executorUser.id },
    update: {},
    create: {
      userId: executorUser.id,
      balance: 0,
    },
  });

  await prisma.specialist.upsert({
    where: { userId: executorUser.id },
    update: {},
    create: {
      firstName: "خبير طبي",
      avatarSeed: "medical-expert",
      bio: "خبير نبض الطبي للاختبار",
      rating: 5.0,
      hourlyRate: 100,
      totalTasks: 0,
      completedTasks: 0,
      userId: executorUser.id,
    },
  });
  console.log(`  ✓ الخبير الطبي: ${executorUser.email}`);

  // Create admin test user
  console.log("\n🏥 إنشاء مسؤول الاختبار...");
  const adminTestPassword = await bcrypt.hash("testpassword123", 12);
  const adminTestUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "مسؤول الاختبار",
      passwordHash: adminTestPassword,
      roles: [UserRole.ADMIN, UserRole.BUYER],
      emailVerified: new Date(),
    },
  });

  await prisma.wallet.upsert({
    where: { userId: adminTestUser.id },
    update: {},
    create: {
      userId: adminTestUser.id,
      balance: 50000,
    },
  });
  console.log(`  ✓ مسؤول الاختبار: ${adminTestUser.email}`);

  // Create tasks
  console.log("\n💓 تهيئة البروتوكولات الصحية...");
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
  console.log(`  ✓ تم تهيئة ${tasks.length} بروتوكول صحي`);

  // Create specialists
  console.log("\n💓 ربط خبراء الصحة...");
  for (const specialist of specialists) {
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
          totalTasks: Math.floor(Math.random() * 60) + 25,
          completedTasks: Math.floor(Math.random() * 55) + 20,
        },
      });
    }

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
            proficiency: 0.85 + Math.random() * 0.15,
          },
        });
      }
    }
    console.log(`  ✓ تم الربط: ${specialist.firstName}`);
  }

  // Create comprehensive test data: multiple task requests in various states
  console.log("\n💓 إنشاء مشاريع صحية شاملة...");

  const allTasks = await prisma.task.findMany();
  const allSpecialists = await prisma.specialist.findMany();
  const executorSpecialist = await prisma.specialist.findFirst({ where: { userId: executorUser.id } });

  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // 1. COMPLETED project (Arabic)
  const completedTask = allTasks.find(t => t.name === "diagnostic-ai") || allTasks[0];
  const completedSpecialist = allSpecialists.find(s => s.avatarSeed === "dr-ahmad-pulse") || allSpecialists[0];

  const completedRequest = await prisma.taskRequest.create({
    data: {
      userId: testUser.id,
      taskId: completedTask.id,
      description: "نظام تشخيص مبكر للسكري يعمل بدقة 98%. تم تدريبه على 500,000 حالة.",
      status: TaskRequestStatus.COMPLETED,
      totalCost: 6500,
      createdAt: daysAgo(19),
    },
  });

  const completedAssignment = await prisma.taskAssignment.create({
    data: {
      requestId: completedRequest.id,
      specialistId: completedSpecialist.id,
      status: AssignmentStatus.RATED,
      price: 6500,
      confidence: 0.97,
      reasoning: "خبير في الذكاء الاصطناعي الطبي.",
      startedAt: daysAgo(18),
      completedAt: daysAgo(10),
      rating: 5.0,
      feedback: "نظام رائع! ساعد في إنقاذ العديد من المرضى.",
    },
  });
  console.log(`  ✓ تم إنشاء مشروع COMPLETED`);

  await prisma.taskMessage.createMany({
    data: [
      { assignmentId: completedAssignment.id, senderId: testUser.id, senderRole: "BUYER", content: "نحتاج دقة عالية في التشخيص.", createdAt: daysAgo(18) },
      { assignmentId: completedAssignment.id, senderId: testUser.id, senderRole: "SPECIALIST", content: "سأستخدم deep learning للتحليل.", createdAt: daysAgo(17) },
      { assignmentId: completedAssignment.id, senderId: testUser.id, senderRole: "SPECIALIST", content: "النموذج جاهز. الدقة 98.2%.", createdAt: daysAgo(11) },
      { assignmentId: completedAssignment.id, senderId: testUser.id, senderRole: "BUYER", content: "ممتاز! شكراً جزيلاً.", createdAt: daysAgo(10) },
    ],
  });

  // 2. IN_PROGRESS project
  const inProgressTask = allTasks.find(t => t.name === "medical-imaging") || allTasks[1];
  const inProgressSpecialist = allSpecialists.find(s => s.avatarSeed === "dr-fatima-heart") || allSpecialists[1];

  const inProgressRequest = await prisma.taskRequest.create({
    data: {
      userId: testUser.id,
      taskId: inProgressTask.id,
      description: "نظام تحليل الأشعة السينية للكشف عن سرطان الرئة.",
      status: TaskRequestStatus.IN_PROGRESS,
      totalCost: 8000,
      createdAt: daysAgo(5),
    },
  });

  const inProgressAssignment = await prisma.taskAssignment.create({
    data: {
      requestId: inProgressRequest.id,
      specialistId: inProgressSpecialist.id,
      status: AssignmentStatus.IN_PROGRESS,
      price: 8000,
      confidence: 0.95,
      reasoning: "متخصصة في تحليل الصور الطبية.",
      startedAt: daysAgo(4),
    },
  });
  console.log(`  ✓ تم إنشاء مشروع IN_PROGRESS`);

  await prisma.taskMessage.createMany({
    data: [
      { assignmentId: inProgressAssignment.id, senderId: testUser.id, senderRole: "BUYER", content: "لدينا 100,000 صورة للتدريب.", createdAt: daysAgo(5) },
      { assignmentId: inProgressAssignment.id, senderId: testUser.id, senderRole: "SPECIALIST", content: "سأبدأ بتصنيف البيانات.", createdAt: daysAgo(4) },
      { assignmentId: inProgressAssignment.id, senderId: testUser.id, senderRole: "SPECIALIST", content: "اكتمل 60% من التدريب.", createdAt: daysAgo(2) },
    ],
  });

  // 3. MATCHED project
  const matchedTask = allTasks.find(t => t.name === "patient-monitoring") || allTasks[2];

  const matchedRequest = await prisma.taskRequest.create({
    data: {
      userId: testUser.id,
      taskId: matchedTask.id,
      description: "نظام مراقبة المرضى في الوقت الحقيقي لوحدة العناية المركزة.",
      status: TaskRequestStatus.MATCHED,
      createdAt: daysAgo(1),
    },
  });

  const matchedSpecialists = allSpecialists.slice(2, 5);
  for (let i = 0; i < matchedSpecialists.length; i++) {
    await prisma.taskAssignment.create({
      data: {
        requestId: matchedRequest.id,
        specialistId: matchedSpecialists[i].id,
        status: AssignmentStatus.PENDING,
        price: 7000 + (i * 500),
        confidence: 0.93 - (i * 0.03),
        reasoning: `خبير مراقبة المرضى #${i + 1}.`,
      },
    });
  }
  console.log(`  ✓ تم إنشاء مشروع MATCHED`);

  // 4. PENDING project
  const pendingTask = allTasks.find(t => t.name === "drug-discovery") || allTasks[3];

  await prisma.taskRequest.create({
    data: {
      userId: buyer.id,
      taskId: pendingTask.id,
      description: "نحتاج نظام لاكتشاف أدوية جديدة لعلاج السرطان.",
      status: TaskRequestStatus.PENDING,
      createdAt: daysAgo(0),
    },
  });
  console.log(`  ✓ تم إنشاء مشروع PENDING`);

  // 5. Executor assignments
  if (executorSpecialist) {
    const executorTask = allTasks.find(t => t.name === "clinical-trials") || allTasks[4];

    const executorRequest = await prisma.taskRequest.create({
      data: {
        userId: buyer.id,
        taskId: executorTask.id,
        description: "نظام إدارة التجارب السريرية الذكي.",
        status: TaskRequestStatus.IN_PROGRESS,
        totalCost: 9500,
        createdAt: daysAgo(7),
      },
    });

    const executorAssignment = await prisma.taskAssignment.create({
      data: {
        requestId: executorRequest.id,
        specialistId: executorSpecialist.id,
        status: AssignmentStatus.IN_PROGRESS,
        price: 9500,
        confidence: 0.92,
        reasoning: "خبير في إدارة البيانات الطبية.",
        startedAt: daysAgo(6),
      },
    });

    await prisma.taskMessage.createMany({
      data: [
        { assignmentId: executorAssignment.id, senderId: buyer.id, senderRole: "BUYER", content: "نحتاج تتبع 5000 مريض.", createdAt: daysAgo(7) },
        { assignmentId: executorAssignment.id, senderId: executorUser.id, senderRole: "SPECIALIST", content: "سأبني نظام متكامل مع HIPAA compliance.", createdAt: daysAgo(6) },
      ],
    });
    console.log(`  ✓ تم إنشاء مهمة المنفذ IN_PROGRESS`);

    const executorCompletedRequest = await prisma.taskRequest.create({
      data: {
        userId: testUser.id,
        taskId: executorTask.id,
        description: "نظام السجلات الطبية الإلكترونية اكتمل بنجاح.",
        status: TaskRequestStatus.COMPLETED,
        totalCost: 7000,
        createdAt: daysAgo(28),
      },
    });

    await prisma.taskAssignment.create({
      data: {
        requestId: executorCompletedRequest.id,
        specialistId: executorSpecialist.id,
        status: AssignmentStatus.RATED,
        price: 7000,
        confidence: 0.90,
        reasoning: "خبير صحي.",
        startedAt: daysAgo(27),
        completedAt: daysAgo(20),
        rating: 4.9,
        feedback: "نظام ممتاز! سهل الاستخدام.",
      },
    });
    console.log(`  ✓ تم إنشاء مهمة المنفذ COMPLETED`);
  }

  // Credit transactions
  console.log("\n💓 إنشاء سجل المعاملات...");

  const testWallet = await prisma.wallet.findUnique({ where: { userId: testUser.id } });
  if (testWallet) {
    await prisma.creditTransaction.createMany({
      data: [
        { walletId: testWallet.id, type: "CREDIT_PURCHASE", amount: 25000, balance: 25000, description: "رصيد البحث الصحي", createdAt: daysAgo(30) },
        { walletId: testWallet.id, type: "SERVICE_PURCHASE", amount: -6500, balance: 18500, description: "نظام التشخيص", createdAt: daysAgo(19) },
        { walletId: testWallet.id, type: "SERVICE_PURCHASE", amount: -8000, balance: 10500, description: "تحليل الصور", createdAt: daysAgo(5) },
        { walletId: testWallet.id, type: "BONUS", amount: -500, balance: 10000, description: "تسوية الرصيد", createdAt: daysAgo(1) },
      ],
    });
    console.log(`  ✓ تم إنشاء المعاملات للمستخدم التجريبي`);
  }

  const buyerWallet = await prisma.wallet.findUnique({ where: { userId: buyer.id } });
  if (buyerWallet) {
    await prisma.creditTransaction.createMany({
      data: [
        { walletId: buyerWallet.id, type: "CREDIT_PURCHASE", amount: 50000, balance: 50000, description: "رصيد المستشفى", createdAt: daysAgo(25) },
        { walletId: buyerWallet.id, type: "SERVICE_PURCHASE", amount: -9500, balance: 40500, description: "التجارب السريرية", createdAt: daysAgo(7) },
        { walletId: buyerWallet.id, type: "SERVICE_PURCHASE", amount: -15500, balance: 25000, description: "مشاريع أخرى", createdAt: daysAgo(3) },
      ],
    });
    console.log(`  ✓ تم إنشاء المعاملات للمشتري`);
  }

  const executorWallet = await prisma.wallet.findUnique({ where: { userId: executorUser.id } });
  if (executorWallet) {
    await prisma.wallet.update({
      where: { id: executorWallet.id },
      data: { balance: 5600, totalEarnings: 5600 },
    });
    await prisma.creditTransaction.createMany({
      data: [
        { walletId: executorWallet.id, type: "SPECIALIST_EARNING", amount: 5600, balance: 5600, description: "أرباح المشاريع الصحية (80%)", createdAt: daysAgo(20) },
      ],
    });
    console.log(`  ✓ تم إنشاء أرباح المنفذ`);
  }

  console.log(`\n  ✓ تم إنشاء بيانات الاختبار الشاملة`);

  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║  نبض - اكتمل بذر المنصة الصحية!            ║");
  console.log("╚════════════════════════════════════════════╝\n");
  console.log("الوصول الصحي:");
  console.log("  المسؤول: admin@nabd.ai / admin123456");
  console.log("  المستشفى: hospital@nabd.ai / buyer123456 (25000 رصيد)");
  console.log("\nحسابات الاختبار:");
  console.log("  الطبيب: test@example.com / testpassword123 (10000 رصيد)");
  console.log("  الخبير: executor@example.com / testpassword123");
  console.log("  المسؤول: admin@example.com / testpassword123 (50000 رصيد)");
  console.log(`\nخبراء الصحة: ${specialists.length} متصل مع ${tasks.length} بروتوكول صحي\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
