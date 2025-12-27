# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vertex is a dual-purpose marketplace platform built with Next.js 16:
1. **AI Services Marketplace**: AI specialists list services, buyers purchase using credits
2. **Verified Photography Marketplace**: Photographers upload verified photos, buyers license them

Key features:
- **Unified Credit System**: 10 credits = $1 USD, top up wallet, pay upfront (no subscriptions)
- **Flexible Pricing**: One-time, weekly, monthly, or yearly billing
- **Verified Experts**: All specialists and photographers go through verification (KYC/Sumsub)
- **Telegram Bot Integration**: Link accounts, manage orders, receive notifications
- **AI-Powered Matching**: OpenAI integration for specialist-task matching

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production (runs prisma generate first)
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router and Turbopack
- **Database**: PostgreSQL via Prisma ORM with `@prisma/adapter-pg`
- **Auth**: NextAuth v5 (beta) with credentials + Google OAuth
- **UI**: Radix UI primitives, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Storage**: Vercel Blob for file/deliverable storage
- **3D**: React Three Fiber for 3D elements

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Login, register, and onboarding routes
  - `(dashboard)/` - User dashboard and service management
  - `(admin)/` - Admin panel routes
  - `api/` - API endpoints
    - `services/` - Service CRUD operations
    - `orders/` - Order management
    - `telegram/webhook/` - Telegram bot webhook handler
    - `dashboard/` - Dashboard data API
- `components/` - React components
  - `ui/` - shadcn/ui base components
  - `brand/` - Brand-specific components
  - `layout/` - Layout components
  - `three/` - React Three Fiber components
- `lib/` - Core utilities
  - `auth.ts` - NextAuth configuration with role-based access
  - `db.ts` - Prisma client singleton
  - `validations.ts` - Zod schemas
- `prisma/` - Database schema and migrations
- `docs/` - Product documentation
  - `product.md` - Product overview and vision
  - `flows.md` - User flows for all roles
  - `vertex_rework.md` - Transformation guide from Vertex

### Key Features

#### Credit System
- 10 credits = $1 USD
- Users top up wallet, credits deducted per service
- No recurring charges - pay upfront for full duration
- Credits never expire

#### Service Pricing Tiers
| Type | Description |
|------|-------------|
| ONE_TIME | Single deliverable (audit, setup, training) |
| WEEKLY | Ongoing weekly service |
| MONTHLY | Ongoing monthly service |
| YEARLY | Long-term engagement |

#### Order Lifecycle
1. **PENDING** - Awaiting specialist acceptance
2. **IN_PROGRESS** - Work started
3. **DELIVERED** - Specialist submitted work
4. **COMPLETED** - Buyer accepted
5. **CANCELLED** / **DISPUTED** - Edge cases

#### Telegram Bot
The bot (`@VertexBot`) supports:
- `/start` - Welcome message
- `/link <code>` - Link account using code from onboarding
- `/stats` - View service/order statistics
- `/orders` - List active orders
- `/unlink` - Unlink Telegram account

Location: `app/api/telegram/webhook/route.ts`

### Data Model (Key Entities)
- **User**: Supports PHOTOGRAPHER, BUYER, ADMIN, SPECIALIST roles with optional Telegram linking and KYC status
- **PhotographerProfile**: Handle, bio, social links, verification status
- **Photo**: Verified photos with EXIF metadata, licensing options, file hash integrity
- **LicenseOption**: PERSONAL, EDITORIAL, COMMERCIAL, EXTENDED license types
- **Specialist**: AI experts with tasks, ratings, Telegram integration
- **Task/TaskRequest/TaskAssignment**: AI task matching and assignment workflow
- **Wallet/CreditTransaction**: Credits-based payment system
- **Purchase**: Photo licensing purchases with download tokens

### Authentication
Uses NextAuth v5 with JWT strategy. Role helpers available in `lib/auth.ts`:
- `hasRole(roles, role)`, `isAdmin(roles)`, `isSpecialist(roles)`, `isBuyer(roles)`, `isPhotographer(roles)`

## Code Conventions

### ESLint Rules (enforced)
- **No mock data**: Variables/identifiers with `mock`, `dummy`, `fake` are prohibited
- **No empty links**: `href="#"` and `javascript:` hrefs are not allowed
- **Brand colors only**: Arbitrary hex colors are restricted; use CSS variables from `globals.css`
- **UI imports**: Use `@/components/ui/*` instead of direct Radix imports
- **Icons**: Use Simple Line Icons from `react-icons/sl` - lucide-react is restricted
- **Valid internal links**: All internal routes must exist in the codebase (see `VALID_ROUTES` in `eslint.config.mjs`)
- **Buttons must be functional**: All buttons need onClick handler, type="submit", or be inside Link/trigger components

### Product Quality Lint (`npm run lint:product`)
Extended 99-rule config for production readiness. Key rules:
- No console.log in production code
- No hardcoded API URLs or user IDs
- Require try-catch on fetch calls
- Require loading states on async buttons
- Require SEO metadata on pages
- No emojis in UI
- Consistent payment provider (Stripe only)
- No subscription language, no free credits mentions

### Environment Variables
Required variables are documented in `.env.example`:
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless supported)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - Auth configuration
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth (optional)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_WEBHOOK_SECRET` - Webhook verification secret
- `STRIPE_SECRET_KEY` - Stripe for credit purchases
- `OPENAI_API_KEY` - For specialist matching (model: gpt-5-mini-2025-08-07)

## Service Categories
1. AI Strategy & Consulting
2. Machine Learning Development
3. Data Engineering & Analytics
4. LLM & Prompt Engineering
5. Computer Vision
6. NLP & Conversational AI
7. AI Integration & Automation
8. Training & Workshops
9. AI Audits & Compliance
10. Custom AI Development

## Revenue Model
- **Platform Fee**: 20% of transaction value
- **Specialists/Photographers receive**: 80% of service/license price

## Key Workflows

### Task Assignment Flow
1. Buyer submits task request → status: `PENDING`
2. AI matches specialists (OpenAI) → status: `MATCHED`
3. Buyer selects and pays → status: `PAID`
4. Specialist works → status: `IN_PROGRESS`
5. Completion and rating → status: `COMPLETED`

### Photo Licensing Flow
1. Photographer uploads photo with EXIF verification
2. Admin reviews → status: `VERIFIED` or `REJECTED`
3. Buyer requests license → `LicenseRequest` created
4. Buyer purchases → `Purchase` with download token
5. Limited downloads (max 5 by default)
