# Vertex: AI Specialist Matching Platform - Implementation Plan

## Overview
Transform Vertex (photography marketplace) into Vertex (AI specialist matching platform similar to Mercor). Users describe their problems, and AI matches them with specialists who can complete tasks.

---

## Phase 1: Database Schema Changes

### New Models to Create

```prisma
model Specialist {
  id              String   @id @default(cuid())
  firstName       String   // Only first name shown
  avatarSeed      String   // Seed for generating minimalistic avatar (DiceBear)
  bio             String?
  hourlyRate      Float    @default(50)
  rating          Float    @default(5.0)
  totalTasks      Int      @default(0)
  completedTasks  Int      @default(0)
  isAvailable     Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tasks           SpecialistTask[]
  taskAssignments TaskAssignment[]
}

model Task {
  id          String   @id @default(cuid())
  name        String   @unique  // e.g., "data-analysis", "ml-model-training"
  displayName String   // e.g., "Data Analysis"
  description String
  category    String   // e.g., "Machine Learning", "Data Science"
  basePrice   Float    @default(100)
  createdAt   DateTime @default(now())

  specialists SpecialistTask[]
  requests    TaskRequest[]
}

model SpecialistTask {
  id           String     @id @default(cuid())
  specialist   Specialist @relation(fields: [specialistId], references: [id], onDelete: Cascade)
  specialistId String
  task         Task       @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId       String
  proficiency  Float      @default(1.0)  // 0-1 scale for AI matching

  @@unique([specialistId, taskId])
}

model TaskRequest {
  id             String           @id @default(cuid())
  user           User             @relation(fields: [userId], references: [id])
  userId         String
  description    String           // User's problem description
  status         TaskRequestStatus @default(PENDING)
  totalCost      Float?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  task           Task?            @relation(fields: [taskId], references: [id])
  taskId         String?
  assignments    TaskAssignment[]
}

model TaskAssignment {
  id            String        @id @default(cuid())
  request       TaskRequest   @relation(fields: [requestId], references: [id])
  requestId     String
  specialist    Specialist    @relation(fields: [specialistId], references: [id])
  specialistId  String
  status        AssignmentStatus @default(PENDING)
  price         Float
  rating        Float?        // User rates after completion
  feedback      String?
  startedAt     DateTime?
  completedAt   DateTime?
  createdAt     DateTime      @default(now())

  @@unique([requestId, specialistId])
}

enum TaskRequestStatus {
  PENDING      // User submitted, awaiting AI matching
  MATCHED      // AI found specialists
  PAID         // User paid for assignment
  IN_PROGRESS  // Specialist working
  COMPLETED    // Task done
  CANCELLED
}

enum AssignmentStatus {
  PENDING      // Suggested by AI
  ACCEPTED     // User selected this specialist
  IN_PROGRESS  // Specialist working
  COMPLETED    // Task completed
  RATED        // User rated the work
}
```

### Modify Existing Models

```prisma
model User {
  // ... existing fields
  taskRequests    TaskRequest[]
  kycStatus       KycStatus    @default(PENDING)
  kycVerifiedAt   DateTime?
  sumsubApplicantId String?    @unique
}

enum KycStatus {
  PENDING
  IN_PROGRESS
  VERIFIED
  REJECTED
}
```

---

## Phase 2: Seed Data - AI Specialists

Create 20 AI specialists with minimalistic avatars (using DiceBear API) and first names only:

```typescript
const specialists = [
  { firstName: "Alex", skills: ["ml-model-training", "data-analysis", "python-development"] },
  { firstName: "Jordan", skills: ["nlp-processing", "chatbot-development", "text-analysis"] },
  { firstName: "Sam", skills: ["computer-vision", "image-processing", "object-detection"] },
  { firstName: "Morgan", skills: ["data-pipeline", "etl-development", "database-optimization"] },
  { firstName: "Casey", skills: ["api-development", "system-integration", "automation"] },
  // ... 15 more specialists
];

const tasks = [
  { name: "ml-model-training", displayName: "ML Model Training", category: "Machine Learning", basePrice: 500 },
  { name: "data-analysis", displayName: "Data Analysis", category: "Data Science", basePrice: 200 },
  { name: "nlp-processing", displayName: "NLP Processing", category: "AI/ML", basePrice: 400 },
  { name: "computer-vision", displayName: "Computer Vision", category: "AI/ML", basePrice: 600 },
  { name: "chatbot-development", displayName: "Chatbot Development", category: "Automation", basePrice: 350 },
  // ... more tasks
];
```

Avatar generation using DiceBear:
```
https://api.dicebear.com/7.x/shapes/svg?seed=${avatarSeed}
```

---

## Phase 3: OpenAI Structured Output for Matching

### API Endpoint: `/api/match-specialists`

```typescript
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const MatchResult = z.object({
  matches: z.array(z.object({
    taskName: z.string(),
    specialistId: z.string(),
    confidence: z.number(),
    reasoning: z.string(),
  })),
  suggestedTasks: z.array(z.string()),
});

export async function matchSpecialists(userDescription: string, availableTasks: Task[], specialists: Specialist[]) {
  const client = new OpenAI();

  const response = await client.responses.parse({
    model: "gpt-4.1-mini",
    instructions: `You are an AI specialist matching system. Given a user's problem description,
    analyze it and match with the most suitable specialists and tasks from the available pool.
    Consider specialist ratings, task proficiency, and relevance to the problem.`,
    input: JSON.stringify({
      userProblem: userDescription,
      availableTasks: availableTasks.map(t => ({ id: t.id, name: t.name, description: t.description })),
      specialists: specialists.map(s => ({
        id: s.id,
        name: s.firstName,
        rating: s.rating,
        tasks: s.tasks.map(st => ({ taskId: st.taskId, proficiency: st.proficiency }))
      }))
    }),
    text: {
      format: zodTextFormat(MatchResult, "match_result"),
    },
  });

  return response.output_parsed;
}
```

---

## Phase 4: Credit System & Payments

### Existing Infrastructure
- `Wallet` model already exists with `balance`, `totalSpent`, `totalEarnings`
- `CreditTransaction` model tracks all credit movements

### New API Endpoints

1. **`/api/credits/purchase`** - Buy credits (Stripe integration)
2. **`/api/task-request/create`** - Submit problem description
3. **`/api/task-request/[id]/pay`** - Pay for matched specialist
4. **`/api/task-request/[id]/complete`** - Mark task complete and rate

### Flow
1. User purchases credits → Wallet balance increases
2. User submits problem → AI matches specialists
3. User selects specialist → Credits reserved
4. Specialist completes task → Credits transferred
5. User rates specialist → Rating updated

---

## Phase 5: Sumsub KYC Integration

### Integration Points

1. **Onboarding Step 3** - Replace placeholder with Sumsub WebSDK
2. **API Endpoint** - `/api/kyc/webhook` for Sumsub callbacks
3. **Status Tracking** - Update user's `kycStatus` based on verification

```typescript
// Sumsub WebSDK integration
import snsWebSdk from "@aspect-sdk/web-sdk";

const launchWebSdk = (accessToken: string) => {
  snsWebSdk.init(accessToken, () => getNewAccessToken())
    .withConf({ lang: "en" })
    .withOptions({ addViewportTag: false })
    .on("idCheck.onStepCompleted", (payload) => { /* handle */ })
    .on("idCheck.onApplicantStatusChanged", (payload) => { /* handle */ })
    .build()
    .launch("#sumsub-websdk-container");
};
```

---

## Phase 6: UI Components

### New Pages

1. **`/specialists`** - Browse all specialists with avatars and ratings
2. **`/request`** - Submit problem and view AI matches
3. **`/dashboard/requests`** - User's task requests and status
4. **`/dashboard/credits`** - Credit balance and purchase history

### New Components

1. **`SpecialistCard`** - Minimalistic card with DiceBear avatar, first name, rating, tasks
2. **`MatchResults`** - Display AI-matched specialists with confidence scores
3. **`CreditPurchase`** - Credit package selector and Stripe checkout
4. **`TaskRequestForm`** - Problem description input with rich text
5. **`KycVerification`** - Sumsub WebSDK container

---

## Implementation Order

1. **Schema & Migrations** (~30 min)
   - Update Prisma schema with new models
   - Run `npx prisma db push`
   - Generate Prisma client

2. **Seed Data** (~20 min)
   - Create seed script for specialists and tasks
   - Generate DiceBear avatar seeds

3. **API Endpoints** (~45 min)
   - `/api/match-specialists` - OpenAI matching
   - `/api/task-request/*` - CRUD operations
   - `/api/credits/purchase` - Credit purchase

4. **UI Pages** (~60 min)
   - Specialists browse page
   - Task request flow
   - Dashboard updates

5. **Sumsub Integration** (~30 min)
   - WebSDK setup
   - Webhook handler

6. **Testing** (~30 min)
   - End-to-end flow test
   - Edge cases

---

## Files to Create/Modify

### Create
- `prisma/seed-specialists.ts`
- `app/api/match-specialists/route.ts`
- `app/api/task-request/route.ts`
- `app/api/task-request/[id]/pay/route.ts`
- `app/api/kyc/token/route.ts`
- `app/api/kyc/webhook/route.ts`
- `app/specialists/page.tsx`
- `app/request/page.tsx`
- `app/(dashboard)/dashboard/requests/page.tsx`
- `app/(dashboard)/dashboard/credits/page.tsx`
- `components/specialists/specialist-card.tsx`
- `components/specialists/match-results.tsx`
- `components/kyc/sumsub-verification.tsx`

### Modify
- `prisma/schema.prisma` - Add new models
- `app/(auth)/onboarding/page.tsx` - Integrate Sumsub
- `components/layout/header.tsx` - Add specialists link
- `lib/validations.ts` - Add new Zod schemas

---

## Environment Variables Required

```env
# Sumsub KYC
SUMSUB_APP_TOKEN=your_app_token
SUMSUB_SECRET_KEY=your_secret_key
SUMSUB_WEBHOOK_SECRET=your_webhook_secret

# Stripe (for credit purchases)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Success Criteria

1. ✅ User can register and complete KYC verification
2. ✅ User can purchase credits
3. ✅ User can describe a problem and receive AI-matched specialists
4. ✅ User can select and pay for a specialist
5. ✅ Specialist ratings update based on task completion
6. ✅ All specialists show minimalistic avatars and first names only
