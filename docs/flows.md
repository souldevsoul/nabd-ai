# Catalyst - User Flows

## 1. Buyer Flows

### 1.1 Registration & Onboarding
```
Landing Page → "Get Started" → Registration Form
  ↓
Email/Password + Name → Account Created
  ↓
Onboarding Welcome → Optional: Add Credits
  ↓
Dashboard (empty state with prompts to browse services)
```

### 1.2 Browse & Discover Services
```
Gallery/Marketplace → Browse All Services
  ↓
Filter by: Category | Price Range | Rating | Availability
  ↓
Search: Keywords, specialist name, skill tags
  ↓
Service Cards: Title, Specialist, Price, Rating, Preview
  ↓
Click → Service Detail Page
```

### 1.3 Service Detail View
```
Service Detail Page:
├── Service Info (title, description, deliverables)
├── Pricing Tiers (one-time, weekly, monthly, yearly)
├── Specialist Profile (name, bio, rating, portfolio)
├── Reviews & Ratings
├── FAQ / What's Included
└── "Purchase" CTA
```

### 1.4 Purchase Flow
```
Click "Purchase" → Select Duration/Tier
  ↓
Check Wallet Balance
  ├── Sufficient → Confirm Purchase
  └── Insufficient → "Top Up Wallet" prompt
      ↓
      Top Up Modal → Select Amount → Payment (Stripe)
      ↓
      Credits Added → Return to Purchase
  ↓
Confirm Purchase → Credits Deducted
  ↓
Purchase Confirmation:
├── Receipt Generated
├── Specialist Notified
├── Chat Channel Opened
└── Redirect to "My Purchases"
```

### 1.5 Wallet Top-Up
```
Wallet Page → "Add Credits" Button
  ↓
Select Amount: $10 (100), $50 (500), $100 (1000), Custom
  ↓
Stripe Checkout → Payment
  ↓
Success → Credits Added to Wallet
  ↓
Transaction History Updated
```

### 1.6 Managing Purchases
```
Dashboard → "My Purchases"
  ↓
Purchase List:
├── Active Services (ongoing)
├── Completed Services
└── Pending (awaiting specialist)
  ↓
Click Purchase → Detail View:
├── Service Details
├── Specialist Contact
├── Deliverables/Files
├── Messages/Chat
└── Leave Review (if completed)
```

---

## 2. Specialist Flows

### 2.1 Registration & Onboarding
```
Landing Page → "Become a Specialist"
  ↓
Registration: Email/Password + Basic Info
  ↓
Onboarding Steps:
├── Step 1: Profile (name, handle, bio, location)
├── Step 2: Expertise (categories, skills, experience)
├── Step 3: Portfolio (past work, case studies)
├── Step 4: Verification (identity, optional skill tests)
└── Step 5: Terms & Agreement
  ↓
Profile Under Review → Approved → Dashboard Access
```

### 2.2 Create Service Listing
```
Dashboard → "Create Service"
  ↓
Service Form:
├── Title & Description
├── Category Selection
├── What's Included (deliverables list)
├── Pricing Tiers:
│   ├── One-Time: X credits
│   ├── Weekly: X credits/week
│   ├── Monthly: X credits/month
│   └── Yearly: X credits/year
├── Availability (capacity, hours)
├── Cover Image / Portfolio Samples
└── Tags / Keywords
  ↓
Preview → Submit for Review
  ↓
Admin Review → Approved → Live on Marketplace
```

### 2.3 Managing Services
```
Dashboard → "My Services"
  ↓
Service List:
├── Active (visible on marketplace)
├── Draft (not published)
├── Paused (temporarily hidden)
└── Archived
  ↓
Click Service → Edit, Pause, View Stats
```

### 2.4 Handling Orders
```
New Order Notification (email + in-app)
  ↓
Dashboard → "Orders"
  ↓
Order Detail:
├── Buyer Info
├── Service Purchased
├── Duration/Tier
├── Start Date
└── Actions: Accept, Message Buyer, Deliver
  ↓
Accept Order → Work Begins
  ↓
Deliver Work:
├── Upload Deliverables
├── Add Notes
└── Mark Complete
  ↓
Buyer Review → Payment Released to Wallet
```

### 2.5 Wallet & Payouts
```
Wallet Page:
├── Available Balance (earned from orders)
├── Pending (in escrow)
├── Total Earned
└── Transaction History
  ↓
"Withdraw" → Bank/Stripe Connect
  ↓
Withdrawal Processed → Bank Transfer
```

---

## 3. Admin Flows

### 3.1 Specialist Verification
```
Admin Dashboard → "Pending Specialists"
  ↓
Review Application:
├── Profile Info
├── Portfolio
├── Identity Docs
└── Skill Claims
  ↓
Decision: Approve / Reject / Request More Info
  ↓
Notify Specialist
```

### 3.2 Service Moderation
```
Admin Dashboard → "Pending Services"
  ↓
Review Service:
├── Content Quality
├── Pricing Fairness
├── Category Accuracy
└── Policy Compliance
  ↓
Decision: Approve / Reject / Edit Request
```

### 3.3 Dispute Resolution
```
Dispute Filed (buyer or specialist)
  ↓
Admin Dashboard → "Disputes"
  ↓
Review Case:
├── Order Details
├── Messages/Communication
├── Deliverables
└── Both Parties' Claims
  ↓
Resolution:
├── Refund Buyer (full/partial)
├── Pay Specialist
├── Split Decision
└── Account Actions (warning, suspension)
```

---

## 4. Core Interaction Flows

### 4.1 Messaging
```
Purchase Made → Chat Channel Created
  ↓
Buyer & Specialist can message:
├── Text Messages
├── File Attachments
├── Quick Actions (mark complete, request revision)
└── System Messages (order updates)
```

### 4.2 Review Flow
```
Order Marked Complete by Specialist
  ↓
Buyer Notification: "Leave a Review"
  ↓
Review Form:
├── Star Rating (1-5)
├── Written Review
└── Optional: Private Feedback
  ↓
Review Published → Specialist Rating Updated
```

### 4.3 Search & Discovery
```
Marketplace Search Bar
  ↓
Query: "machine learning model training"
  ↓
Results:
├── Matching Services (by title, description, tags)
├── Matching Specialists (by skills, bio)
└── Matching Categories
  ↓
Filters Applied → Refined Results
```

---

## 5. Key Pages Summary

| Page | Primary User | Purpose |
|------|--------------|---------|
| `/` | All | Landing page, value prop |
| `/marketplace` | Buyers | Browse all services |
| `/marketplace/[id]` | Buyers | Service detail |
| `/specialists` | Buyers | Browse specialists |
| `/specialist/[handle]` | Buyers | Specialist profile |
| `/dashboard` | Auth Users | Overview & stats |
| `/dashboard/services` | Specialists | Manage services |
| `/dashboard/services/new` | Specialists | Create service |
| `/dashboard/orders` | Both | View orders |
| `/dashboard/wallet` | Both | Credits & transactions |
| `/dashboard/messages` | Both | Conversations |
| `/settings` | Auth Users | Account settings |
| `/admin` | Admins | Admin panel |
