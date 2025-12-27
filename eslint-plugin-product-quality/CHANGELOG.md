# Changelog

All notable changes to `eslint-plugin-product-quality` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.11.1] - 2025-11-24

### Improved - 10 Rules Enhanced

- **`require-consistent-logo`** - Better logo context detection
  - Only considers icons inside `<Link href="/">` as logo context
  - Ignores icons in header/footer that are not homepage links

- **`require-focus-visible`** - Skip React components
  - Skip Button, Link, Input components (have built-in focus states)
  - Handle ternary expressions in className

- **`require-hover-states`** - Skip React components
  - Skip Button, Link components (have built-in hover states)
  - Handle ternary expressions in className

- **`require-functional-auth-system`** - Fix logout route detection
  - Use route.ts/route.tsx for API routes, not page.tsx

- **`require-legal-pages-plain-format`** - Better decorative element detection
  - Detect border-black decorative borders
  - Detect bg-black decorative backgrounds

- **`require-payment-compliance`** - Precise pattern matching
  - Word boundary for VAT/TVA (avoid matching "derivative")
  - Only detect acquirer names in visible text `>text<`

- **`require-schema-markup`** - Handle ternary expressions
  - Extract schema from ConditionalExpression (ternary operators)

- **`require-seo-meta-tags`** - Client component handling
  - Detect "use client" directive and skip metadata check
  - Handle title as object `{ default: "...", template: "..." }`

- **`require-sufficient-contrast`** - Extended color support
  - Support bg-white, bg-black, text-white, text-black
  - Better className extraction from template literals

- **`require-text-color-contrast`** - Skip elements with own background
  - Ignore elements that have their own bg-*-\d+ class

### Stats
- Total rules: **83** (no change)
- All 83 test suites passing
- Improved false positive reduction

---

## [1.11.0] - 2025-11-24

### Added - Project Quality Rules

- **`require-project-isolation`** - Template Artifact Detection
  - Detects leftover references from template/starter projects
  - Catches placeholder image files (placeholder.png, sample.jpg, etc.)
  - Warns about boilerplate, starter, example-app, acme references
  - Configurable via `templatePatterns` and `imagePatterns` options
  - Helps ensure clean project separation after cloning templates

### Stats
- Total rules: **83** (+1)
- Test files: **83** (100% coverage)
- Total tests: **377** (+17)

---

## [1.10.1] - 2025-11-24

### Added - Complete Priority 0 Security Rules 🔒

- **`require-rate-limiting`** - DoS/Brute Force Prevention
  - Ensures auth endpoints (login, signup, reset-password) have rate limiting
  - Detects @upstash/ratelimit, express-rate-limit, throttle middleware
  - Critical for PCI-DSS compliance

### Stats
- Total rules: **82** (+1)
- Test files: **82** (100% coverage)
- Total tests: **360** (+11)

---

## [1.10.0] - 2025-11-24

### Added - Priority 0 Security Rules 🔒

3 new critical security rules based on OWASP Top 10 and PCI-DSS requirements:

- **`require-input-sanitization`** - XSS Prevention
  - Detects `dangerouslySetInnerHTML` without sanitization
  - Flags SQL injection patterns in template literals
  - Requires DOMPurify.sanitize() or similar for HTML content
  - Warns about unsanitized user input rendering

- **`require-csrf-protection`** - CSRF Prevention
  - Ensures POST/PUT/DELETE/PATCH API routes validate CSRF tokens
  - Detects missing x-csrf-token header validation
  - Checks for validateCsrfToken() or similar function calls
  - Works with Next.js App Router API routes

- **`require-critical-path-error-handling`** - Error Handling
  - Ensures checkout, payment, login, signup functions have try-catch
  - Detects empty catch blocks in critical functions
  - Configurable critical function patterns
  - Prevents silent failures in revenue-critical flows

### Stats
- Total rules: **81** (+3)
- Test files: **81** (100% coverage)
- Total tests: **349** (+28)
- New security category added

---

## [1.9.2] - 2025-11-24

### Added - Payment Logo Compliance Enhancements

New rule and enhanced validation based on payment processor brand guidelines:

- **`require-payment-logos-on-page`** - NEW RULE
  - Ensures Visa/Mastercard logos are displayed on pricing/checkout pages
  - Configurable paths: `/pricing`, `/checkout`, `/payment`, `/subscribe`
  - Option to require specific logos

- **`require-payment-logo-compliance`** - ENHANCED
  - Added minimum size validation per brand guidelines
  - Visa minimum width: 40px
  - Mastercard minimum width: 44px
  - New messageIds: `visaTooSmall`, `mastercardTooSmall`

### Stats
- Total rules: **78** (+1)
- Test files: **78** (100% coverage)
- Total tests: **321** (+31)

---

## [1.9.1] - 2025-11-24

### Added - Testing Infrastructure & Quality Tooling

Comprehensive testing and quality infrastructure for all 77 rules:

- **Unit Tests for All Rules** - 290 tests across 77 test suites
  - Every rule has a dedicated `*.test.js` file
  - Tests cover valid/invalid code patterns
  - Using Jest + ESLint RuleTester

- **CI/CD Pipeline** - GitHub Actions workflow (`.github/workflows/ci.yml`)
  - Automatic testing on push/PR
  - Plugin validation
  - Version consistency checks
  - Release automation

- **Recommended Configurations** - 3 preset configs
  - `recommended.js` - Core rules for all projects
  - `strict.js` - All 77 rules as errors
  - `payment-compliance.js` - Payment-specific rules

- **Validation Script Enhancement**
  - New test coverage check in `scripts/validate-plugin.js`
  - Reports rules without tests
  - Shows test coverage percentage in summary

### Stats
- Total rules: **77** (unchanged)
- Test files: **77** (100% coverage)
- Total tests: **290** (all passing)

---

## [1.9.0] - 2025-11-22

### Added - Payment Processor Compliance Rules

9 new rules based on `payment-compliance-audit.skill` analysis for Visa/Mastercard/AML compliance:

- **`no-b2b-language`** - Prohibits B2B tier names (Business, Corporate, Enterprise)
  - Payment processors require B2C-only products
  - Flags: "for teams", "for businesses", "enterprise plan", etc.

- **`require-discount-limits`** - Ensures discounts are within 3-15% range
  - Acquirers question large discounts
  - Acceptable: 3%, 5%, 8%, 12%, 15%

- **`no-vat-number-display`** - Prohibits VAT number display
  - For companies not VAT registered
  - Checks various EU VAT formats

- **`require-currency-format`** - Requires symbol + code format
  - Correct: €29.99 EUR, $50.00 USD
  - Checks pricing-related files

- **`require-physical-address-checkout`** - Physical address on checkout
  - Merchant Outlet Location required on checkout page
  - Different from registration address in footer

- **`require-support-contact-complete`** - Complete contact info
  - International phone format: +XX XXX XXX XXXX
  - Support email address required
  - Checks footer and contact files

- **`no-acquirer-name-display`** - Never display payment processor name
  - CRITICAL: Acquirer names must not appear
  - Allows "Pay with PayPal" style buttons

- **`require-testimonial-disclaimer`** - Disclaimer for test testimonials
  - NO fake testimonials pre-launch
  - Requires "Early Access Feedback" or similar label

- **`require-receipt-template-fields`** - All required receipt fields
  - Amount, currency, date, merchant name, card info
  - Support contact, policy links, transaction type

### Stats
- Total rules: **77** (68 → 77, +9 new)
- New category: Payment Processor Compliance
- Source: payment-compliance-audit.skill

---

## [1.8.2] - 2025-11-22

### Bug Fixes - Reduce False Positives

- **`require-empty-state`** - Skip API routes (`/api/`, `/route.`)
  - API routes return JSON, not UI - empty state check not applicable

- **`require-loading-states`** - Skip API routes and handlers
  - Skip files in `/api/` directory
  - Skip API handler functions (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)

- **`require-modern-saas-patterns`** - Improved detection
  - Added Mantine Notifications (`@mantine/notifications`) as valid toast library
  - Skip icon components when checking error states (Ri*, *Icon, *Warning, *Alert)
  - For self-closing components (`<ErrorContent />`), check full file for retry action

- **`require-schema-markup`** - Smarter page detection
  - Skip internal pages: `/dashboard/`, `/admin/`, `/specialist/`, `/auth/`, `/api/`, `/components/`
  - Improved @type detection (string literals and object properties)
  - Added VariableDeclarator visitor for schema in variables
  - Smarter FAQ detection: check file path (`/faq/`) + require ≥3 question/answer pairs
  - Smarter testimonials detection: require rating/stars or numeric scores

### Stats
- Total rules: **68** (unchanged)
- False positive fixes: 4 rules improved

---

## [1.8.1] - 2025-11-22

### Added Missing Rules
- **`no-emojis-in-ui`** - Prevents emojis in UI components
  - Use proper icon components instead of emojis
  - Emojis render inconsistently across devices
  - Improves professionalism and accessibility

- **`require-consistent-icon-library`** - Enforces single icon library
  - Prevents mixing lucide-react, react-icons, heroicons, etc.
  - Configurable approved library (default: lucide-react)
  - Prohibits react-icons by default

### Documentation Update
- Updated README.md with all 68 rules
- Updated docs/RULES.md with complete rule reference
- All rules now documented with 'error' status requirement

### Stats
- Total rules: **68** (was 66)
- New in v1.8.1: 2 rules (previously missing from index.js)

---

## [1.8.0] - 2025-11-21

### New Rules - High-Priority Cross-Project (4 rules)
- **`require-page-metadata`** - All pages must have metadata export
- **`require-proper-page-structure`** - Proper semantic page structure
- **`enforce-color-contrast`** - WCAG color contrast enforcement
- **`no-external-links-without-target`** - External links need target="_blank"

### Stats
- Total rules: 66 (was 62)

---

## [1.7.0] - 2025-11-21

### New Rules - UI Polish & Perfection (5 rules)
- **`require-consistent-spacing`** - Consistent spacing system
- **`require-hover-states`** - Interactive elements need hover states
- **`require-focus-visible`** - Focus states must be visible
- **`require-proper-heading-hierarchy`** - Sequential heading levels
- **`no-inline-styles`** - No inline styles, use Tailwind

### Stats
- Total rules: 62 (was 57)

---

## [1.6.0] - 2025-11-20

### New Rules - Complete Product Flow (6 rules)
- **`require-complete-user-flow`** - Complete user flows implemented
- **`require-complete-api-routes`** - All API routes implemented
- **`require-dashboard-settings-complete`** - Dashboard settings complete
- **`require-admin-panel`** - Admin panel exists
- **`require-invoice-management`** - Invoice management implemented
- **`require-payment-compliance`** - Payment compliance met

### Stats
- Total rules: 57 (was 51)

---

## [1.4.5] - 2025-11-20

### New Rules
- **`require-consistent-legal-page-design`** - Legal pages have consistent design
- **`require-tailwind-config-consistency`** - Tailwind config matches brand guide

---

## [1.4.4] - 2025-11-20

### ✨ New Rule
- **`require-brand-import`** - Requires BRAND import when using BRAND constant
  - Detects: `BRAND.name.canonical` without import
  - Prevents: ReferenceError "BRAND is not defined"
  - Message: "BRAND is used but not imported. Add: import { BRAND } from '@/lib/brand'"

### 🔧 Technical Details
- Checks `MemberExpression` for BRAND usage (e.g., `BRAND.name.canonical`)
- Checks `Identifier` for direct BRAND usage
- Validates import from `@/lib/brand`
- Reports once per file at first usage

### 🐛 Real-World Prevention
- Would have caught FashionForge bugs in 7 files
- Prevents copy-paste errors from templates
- Runtime safety for brand constant usage

### 📊 Stats
- Total rules: 49 (was 48)
- New in v1.4.4: 1 rule

---

## [1.4.3] - 2025-11-20

### 🐛 Bug Fix
- **ENHANCED**: `require-legal-pages-plain-format` now detects react-icons usage in object properties
  - Example: `icon: RiCheckLine` in legal pages now triggers error
  - Prevents runtime ReferenceError from undefined icon variables
  - Regex pattern: `/^Ri[A-Z][a-zA-Z]*(?:Line|Fill|Solid)$/`

### 🔧 Technical Details
- Added `Property` node visitor to detect `icon: Ri*Line` patterns
- Checks object properties with key "icon" and Identifier value
- Reports using existing `iconImport` message

### 🐛 Fixed in Projects
- FashionForge: Removed 15 icon declarations from legal pages (terms, privacy)

---

## [1.4.2] - 2025-11-20

### 🐛 Bug Fixes
- **FIXED**: `consistent-company-info` false positives for brand names containing base template names
  - Example: "PETPORTRAIT.AI" was incorrectly flagged for containing "PetPortrait"
  - Now skips checking if configured name includes the template name
  - Fixes 97 false positive errors in PetPortrait-AI project

### 🔧 Technical Details
- Added logic to skip template name checks when configured brand contains that template name
- Applied fix to both `Literal` and `JSXText` node checks
- Example: `normalizedConfigured.includes(normalizedProduct)` check added

---

## [1.4.1] - 2025-11-20

### 🐛 Bug Fixes
- **CRITICAL FIX**: `no-broken-internal-links` now properly detects broken links
  - Added support for `JSXExpressionContainer` (e.g., `href={"/path"}`)
  - Fixed bug where `href="/path"` links were not being validated
  - Now correctly reports missing page files for legal/marketing pages

### ✨ New Rules
- **`require-legal-pages-exist`** - Validates footer/header legal page links
  - Checks that `/terms`, `/privacy`, `/cookie-policy`, `/refund-policy` exist
  - Scans Footer and Header components for legal links
  - Prevents 404 errors on critical legal pages

### 📝 Documentation
- Added comprehensive README.md
- Added CHANGELOG.md (this file)
- Added RULES.md with all rule documentation

---

## [1.4.0] - 2025-11-20

### ✨ New Rules - Advanced Quality (5 rules)

- **`require-loading-states`** - Async components must handle loading states
  - Validates Server Components have Suspense boundaries
  - Ensures fetch() calls are wrapped in try-catch
  - Checks for loading/error UI in async operations

- **`require-error-boundaries`** - Error boundaries must exist
  - Requires global `app/error.tsx` file
  - Optional route-specific error pages
  - Prevents uncaught errors from crashing the app

- **`no-console-logs-production`** - No debug logs in production code
  - Allows `console.warn` and `console.error` by default
  - Excludes test/dev/config files
  - Auto-fix removes console statements
  - Also checks `debugger`, `alert`, `prompt`, `confirm`

- **`require-seo-meta-tags`** - Page-level SEO metadata validation
  - Only checks `page.tsx` and `layout.tsx` in `/app/`
  - Validates `metadata` export exists
  - Checks title length (30-60 chars)
  - Checks description length (50-160 chars)
  - Requires Open Graph tags for social sharing

- **`require-accessible-forms`** - Form accessibility and validation
  - Forms must have `onSubmit` or `action`
  - Inputs must have `type` attribute
  - Email inputs use `type="email"`
  - Requires labels or `aria-label` for accessibility

---

## [1.3.0] - 2025-11-19

### ✨ New Rules - Accessibility & Design (3 rules)

- **`require-sufficient-contrast`** - WCAG AA color contrast compliance
- **`require-appropriate-text-color-for-background`** - Text colors match backgrounds
- **`no-blog-pages`** - Prevents blog/news sections in AI SaaS products

---

## [1.2.0] - 2025-11-19

### ✨ New Rules - Critical Priority (3 rules)

- **`require-unique-page-titles`** - SEO-friendly unique page titles
- **`require-responsive-images`** - Responsive image loading with Next.js Image
- **`no-hardcoded-api-urls`** - API URLs use environment variables

---

## [1.1.0] - 2025-11-19

### ✨ New Rules - Modern SaaS Best Practices (7 rules)

- **`require-seo-metadata`** - Complete SEO metadata validation
- **`require-performance-monitoring`** - Performance tracking
- **`require-mobile-responsive`** - Mobile-first responsive design
- **`require-modern-saas-patterns`** - Modern SaaS UI patterns
- **`require-security-headers`** - Security headers in responses
- **`require-schema-markup`** - Structured data markup

---

## [1.0.0] - 2025-11-18

### ✨ Initial Release - LogoSmith Quality Rules (4 rules)

- **`require-legal-pages-plain-format`** - Legal pages use plain text format
  - No icons, emojis, gradients in legal documents
  - Allows simple hero gradient only
  - Professional document formatting

- **`require-logo-links-home`** - Logo must link to homepage
  - Universal UX pattern enforcement
  - Prevents broken navigation

- **`require-navigation-in-header`** - Marketing headers include navigation
  - Ensures proper header structure
  - Required navigation links

- **`require-payment-logo-compliance`** - Official payment brand guidelines
  - Stripe, Visa, Mastercard logo compliance
  - Correct file paths and aspect ratios

---

## [0.9.0] - 2025-11-17

### 🎉 Foundation - Core Quality Rules (30+ rules)

#### Link & Navigation
- `no-broken-internal-links` - Prevents 404 errors

#### Branding
- `consistent-company-info` - Company name and email
- `require-consistent-logo` - Same logo everywhere
- `consistent-payment-providers` - Single payment provider

#### Design System
- `use-styleguide-colors-only` - Color palette enforcement
- `require-text-color-contrast` - WCAG compliance
- `no-brutalist-design` - Modern design patterns

#### Layout
- `require-consistent-layout` - Header/footer on all pages

#### UX & Functionality
- `no-button-without-handler` - Functional buttons
- `no-form-without-submit` - Functional forms
- `require-loading-state-on-async-button` - Loading states
- `require-try-catch-fetch` - Error handling
- `require-empty-state` - Empty state UI

#### Accessibility
- `no-missing-alt-text` - Image alt text
- `require-aria-label-on-icon-buttons` - Icon button labels

#### Content
- `no-social-media-links` - No social in marketing
- `no-generic-placeholders` - No Lorem ipsum
- `no-fake-content` - No fake statistics
- `email-must-match-domain` - Email validation

#### Authentication & Features
- `require-functional-auth-system` - Complete auth
- `require-auth-aware-header` - Auth-aware headers
- `require-credit-system` - Credit/subscription system
- `require-cookie-consent` - GDPR compliance

#### Configuration
- `require-environment-variables` - Env var validation

#### Performance
- `require-image-optimization` - Next.js Image usage

---

## Version History Summary

| Version | Date | Total Rules | Major Changes |
|---------|------|-------------|---------------|
| 1.9.1 | 2025-11-24 | 77 | Unit tests (290), CI/CD pipeline, preset configs |
| 1.9.0 | 2025-11-22 | 77 | 9 payment compliance rules from skill analysis |
| 1.8.2 | 2025-11-22 | 68 | Bug fixes: reduce false positives in 4 rules |
| 1.8.1 | 2025-11-22 | 68 | Added missing rules to index.js |
| 1.8.0 | 2025-11-21 | 66 | High-Priority Cross-Project rules |
| 1.7.0 | 2025-11-21 | 62 | UI Polish & Perfection rules |
| 1.6.0 | 2025-11-20 | 57 | Complete Product Flow rules |
| 1.4.5 | 2025-11-20 | 51 | Legal page design consistency |
| 1.4.4 | 2025-11-20 | 49 | BRAND import validation |
| 1.4.1 | 2025-11-20 | 48 | Bug fix + legal pages validation |
| 1.4.0 | 2025-11-20 | 47 | Advanced quality rules |
| 1.3.0 | 2025-11-19 | 42 | Accessibility & design |
| 1.2.0 | 2025-11-19 | 39 | Critical priority rules |
| 1.1.0 | 2025-11-19 | 36 | Modern SaaS best practices |
| 1.0.0 | 2025-11-18 | 30 | LogoSmith quality rules |
| 0.9.0 | 2025-11-17 | 26 | Foundation |

**Total Rules:** 77

---

## Upgrade Guide

### From 1.4.0 to 1.4.1

No breaking changes. Simply copy updated files:

```bash
# Copy updated plugin files
cp -r /path/to/logosmith/eslint-plugin-product-quality/* ./eslint-plugin-product-quality/

# Add new rule to config
# eslint.config.product.mjs
'product-quality/require-legal-pages-exist': 'error',
```

### From 1.3.0 to 1.4.0

Add new rules to your config:

```javascript
// Advanced quality rules
'product-quality/require-loading-states': 'error',
'product-quality/require-error-boundaries': 'error',
'product-quality/no-console-logs-production': 'error',
'product-quality/require-seo-meta-tags': 'error',
'product-quality/require-accessible-forms': 'error',
```

---

## Future Roadmap

### v1.5.0 (Planned)
- [ ] API routes error handling validation
- [ ] Database query optimization checks
- [ ] Rate limiting enforcement
- [ ] Email template validation

### v2.0.0 (Planned)
- [ ] TypeScript-first rules
- [ ] React Server Components validation
- [ ] Suspense boundary optimization
- [ ] Performance budget enforcement

---

**Maintained by:** AutoQA Team
**License:** MIT
