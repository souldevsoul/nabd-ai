# eslint-plugin-product-quality

**AutoQA ESLint Plugin for AI SaaS Projects**

Comprehensive ESLint plugin enforcing product quality standards across Next.js AI SaaS applications. Ensures consistent branding, prevents broken links, validates design systems, and enforces best practices.

---

## Installation

```bash
# This is a local plugin - already included in your project
# Located at: eslint-plugin-product-quality/
```

## Current Version

**v1.12.0** (2025-11-24)

### ✨ Latest Changes (v1.12.0)
- **Auto-Fix Support**: 3 rules now support `eslint --fix`
  - `no-missing-alt-text` - Automatically adds `alt=""` to images
  - `no-external-links-without-target` - Adds `target="_blank" rel="noopener noreferrer"`
  - `require-aria-label-on-icon-buttons` - Adds `aria-label="Button"` to icon buttons
- **Deprecated Rules**: 2 redundant contrast rules deprecated
  - `enforce-color-contrast` → use `require-sufficient-contrast`
  - `require-appropriate-text-color-for-background` → use `require-text-color-contrast`
- **Schema Definitions**: All 83 rules now have complete ESLint schema support
- Total rules: **83** (81 active + 2 deprecated)

### Recent Changes (v1.11.0 - v1.11.1)
- Added `require-project-isolation` rule
- Improved 10 rules with better detection and fewer false positives
- Fixed `no-brutalist-design` detection patterns

### Recent Changes (v1.10.0 - v1.10.1)
- Added 4 Priority 0 security rules (OWASP Top 10 / PCI-DSS)
- `require-input-sanitization`, `require-csrf-protection`, `require-critical-path-error-handling`, `require-rate-limiting`

---

## Rules Overview

### Total Rules: **83** (81 active + 2 deprecated)

All rules must be enabled with status `error`. No warnings or disabled rules allowed.

---

### Link & Navigation (3 rules)
| Rule | Description |
|------|-------------|
| `no-broken-internal-links` | Prevents 404 errors from broken navigation |
| `require-legal-pages-exist` | Ensures footer/header legal links point to existing pages |
| `no-external-links-without-target` | External links must have target="_blank" |

### Branding & Design System (13 rules)
| Rule | Description |
|------|-------------|
| `consistent-company-info` | Enforces consistent company name and email |
| `require-consistent-logo` | Same logo file across all components |
| `consistent-payment-providers` | Single payment provider (Stripe) |
| `use-styleguide-colors-only` | Enforces color palette |
| `require-text-color-contrast` | WCAG AA contrast compliance |
| `no-brutalist-design` | Prevents brutalist styling |
| `require-logo-links-home` | Logo must link to homepage |
| `require-payment-logo-compliance` | Official payment brand guidelines |
| `require-sufficient-contrast` | Color contrast for readability |
| `require-appropriate-text-color-for-background` | Text colors match backgrounds |
| `no-fake-content` | No fake statistics or testimonials |
| `enforce-color-contrast` | Enforces WCAG color contrast |
| `require-tailwind-config-consistency` | Tailwind config matches brand guide |

### Layout & Structure (6 rules)
| Rule | Description |
|------|-------------|
| `require-consistent-layout` | Header and footer on all pages |
| `require-navigation-in-header` | Marketing headers include navigation |
| `require-legal-pages-plain-format` | Legal pages use plain text format |
| `require-unique-page-titles` | SEO-friendly unique page titles |
| `require-consistent-legal-page-design` | Legal pages have consistent design |
| `require-proper-page-structure` | Pages have proper semantic structure |

### Accessibility (7 rules)
| Rule | Description |
|------|-------------|
| `no-missing-alt-text` | All images have alt text |
| `require-aria-label-on-icon-buttons` | Icon buttons have aria-label |
| `require-accessible-forms` | Forms have proper labels and validation |
| `require-focus-visible` | Focus states are visible |
| `require-proper-heading-hierarchy` | Heading levels are sequential |
| `no-emojis-in-ui` | No emojis in UI (use icons instead) |
| `require-consistent-icon-library` | Single icon library throughout project |

### UX & Functionality (10 rules)
| Rule | Description |
|------|-------------|
| `no-button-without-handler` | Interactive elements are functional |
| `no-form-without-submit` | Forms have submit handlers |
| `require-loading-state-on-async-button` | Async buttons show loading |
| `require-try-catch-fetch` | Fetch calls wrapped in try-catch |
| `require-empty-state` | Lists/grids show empty states |
| `require-brand-import` | BRAND constant must be imported before use |
| `require-loading-states` | Async components handle loading |
| `require-error-boundaries` | Error boundaries exist |
| `require-hover-states` | Interactive elements have hover states |
| `require-consistent-spacing` | Consistent spacing system |

### Content Restrictions (4 rules)
| Rule | Description |
|------|-------------|
| `no-social-media-links` | No social media in marketing |
| `no-generic-placeholders` | No "Lorem ipsum" or placeholder text |
| `no-blog-pages` | No blog/news sections |
| `no-inline-styles` | No inline styles (use Tailwind) |

### Contact & Communication (1 rule)
| Rule | Description |
|------|-------------|
| `email-must-match-domain` | Email matches domain name |

### Authentication & Features (4 rules)
| Rule | Description |
|------|-------------|
| `require-functional-auth-system` | Complete auth implementation |
| `require-auth-aware-header` | Headers adapt to auth state |
| `require-credit-system` | Credit/subscription system exists |
| `require-cookie-consent` | GDPR cookie consent |

### Configuration & Security (4 rules)
| Rule | Description |
|------|-------------|
| `require-environment-variables` | All env vars are defined |
| `require-security-headers` | Security headers in responses |
| `no-hardcoded-api-urls` | API URLs use environment variables |
| `no-console` | No console statements |

### Performance & Optimization (3 rules)
| Rule | Description |
|------|-------------|
| `require-image-optimization` | Next.js Image component usage |
| `require-responsive-images` | Responsive image loading |
| `require-performance-monitoring` | Performance tracking |

### SEO & Metadata (4 rules)
| Rule | Description |
|------|-------------|
| `require-seo-metadata` | Complete SEO metadata |
| `require-seo-meta-tags` | Page-level meta tags |
| `require-schema-markup` | Structured data markup |
| `require-page-metadata` | All pages have metadata |

### Modern SaaS Patterns (2 rules)
| Rule | Description |
|------|-------------|
| `require-modern-saas-patterns` | Modern SaaS UI patterns |
| `require-mobile-responsive` | Mobile-first responsive design |

### Production Code Quality (2 rules)
| Rule | Description |
|------|-------------|
| `no-console-logs-production` | No debug logs in production |
| `require-complete-user-flow` | Complete user flows implemented |

### Complete Product Flow (5 rules)
| Rule | Description |
|------|-------------|
| `require-complete-api-routes` | All API routes implemented |
| `require-dashboard-settings-complete` | Dashboard settings complete |
| `require-admin-panel` | Admin panel exists |
| `require-invoice-management` | Invoice management implemented |
| `require-payment-compliance` | Payment compliance met |

---

## Usage

### Basic Configuration (Next.js 16 + ESLint 9 Flat Config)

```javascript
// eslint.config.product.mjs
import productQuality from './eslint-plugin-product-quality/index.js';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'product-quality': productQuality,
    },
    rules: {
      // ALL 68 rules must be enabled as 'error'
      // No warnings or disabled rules allowed

      // Link & Navigation
      'product-quality/no-broken-internal-links': 'error',
      'product-quality/require-legal-pages-exist': 'error',
      'product-quality/no-external-links-without-target': 'error',

      // Branding & Design System
      'product-quality/consistent-company-info': 'error',
      'product-quality/require-consistent-logo': 'error',
      'product-quality/consistent-payment-providers': 'error',
      'product-quality/use-styleguide-colors-only': 'error',
      'product-quality/require-text-color-contrast': 'error',
      'product-quality/no-brutalist-design': 'error',
      'product-quality/require-logo-links-home': 'error',
      'product-quality/require-payment-logo-compliance': 'error',
      'product-quality/require-sufficient-contrast': 'error',
      'product-quality/require-appropriate-text-color-for-background': 'error',
      'product-quality/no-fake-content': 'error',
      'product-quality/enforce-color-contrast': 'error',
      'product-quality/require-tailwind-config-consistency': 'error',

      // Layout & Structure
      'product-quality/require-consistent-layout': 'error',
      'product-quality/require-navigation-in-header': 'error',
      'product-quality/require-legal-pages-plain-format': 'error',
      'product-quality/require-unique-page-titles': 'error',
      'product-quality/require-consistent-legal-page-design': 'error',
      'product-quality/require-proper-page-structure': 'error',

      // Accessibility
      'product-quality/no-missing-alt-text': 'error',
      'product-quality/require-aria-label-on-icon-buttons': 'error',
      'product-quality/require-accessible-forms': 'error',
      'product-quality/require-focus-visible': 'error',
      'product-quality/require-proper-heading-hierarchy': 'error',
      'product-quality/no-emojis-in-ui': 'error',
      'product-quality/require-consistent-icon-library': 'error',

      // UX & Functionality
      'product-quality/no-button-without-handler': 'error',
      'product-quality/no-form-without-submit': 'error',
      'product-quality/require-loading-state-on-async-button': 'error',
      'product-quality/require-try-catch-fetch': 'error',
      'product-quality/require-empty-state': 'error',
      'product-quality/require-brand-import': 'error',
      'product-quality/require-loading-states': 'error',
      'product-quality/require-error-boundaries': 'error',
      'product-quality/require-hover-states': 'error',
      'product-quality/require-consistent-spacing': 'error',

      // Content Restrictions
      'product-quality/no-social-media-links': 'error',
      'product-quality/no-generic-placeholders': 'error',
      'product-quality/no-blog-pages': 'error',
      'product-quality/no-inline-styles': 'error',

      // Contact & Communication
      'product-quality/email-must-match-domain': 'error',

      // Authentication & Features
      'product-quality/require-functional-auth-system': 'error',
      'product-quality/require-auth-aware-header': 'error',
      'product-quality/require-credit-system': 'error',
      'product-quality/require-cookie-consent': 'error',

      // Configuration & Security
      'product-quality/require-environment-variables': 'error',
      'product-quality/require-security-headers': 'error',
      'product-quality/no-hardcoded-api-urls': 'error',
      'product-quality/no-console': 'error',

      // Performance & Optimization
      'product-quality/require-image-optimization': 'error',
      'product-quality/require-responsive-images': 'error',
      'product-quality/require-performance-monitoring': 'error',

      // SEO & Metadata
      'product-quality/require-seo-metadata': 'error',
      'product-quality/require-seo-meta-tags': 'error',
      'product-quality/require-schema-markup': 'error',
      'product-quality/require-page-metadata': 'error',

      // Modern SaaS Patterns
      'product-quality/require-modern-saas-patterns': 'error',
      'product-quality/require-mobile-responsive': 'error',

      // Production Code Quality
      'product-quality/no-console-logs-production': 'error',
      'product-quality/require-complete-user-flow': 'error',

      // Complete Product Flow
      'product-quality/require-complete-api-routes': 'error',
      'product-quality/require-dashboard-settings-complete': 'error',
      'product-quality/require-admin-panel': 'error',
      'product-quality/require-invoice-management': 'error',
      'product-quality/require-payment-compliance': 'error',
    },
  },
];
```

### Run Linting

```bash
npm run lint:product
```

---

## Rule Priority

### Critical (Must Fix)
These rules prevent broken functionality or legal issues:
- `no-broken-internal-links`
- `require-legal-pages-exist`
- `require-environment-variables`
- `require-functional-auth-system`
- `require-cookie-consent`
- `require-brand-import`

### High Priority
Important for user experience and brand consistency:
- `consistent-company-info`
- `use-styleguide-colors-only`
- `no-button-without-handler`
- `no-form-without-submit`
- `no-missing-alt-text`
- `no-emojis-in-ui`
- `require-consistent-icon-library`

### All Rules Required
**IMPORTANT:** All 68 rules must be enabled with status `error`.
- No `warn` status allowed
- No `off` status allowed
- Site must pass with 0 errors and 0 warnings

---

## Rule Details

For detailed documentation on each rule, see [../docs/RULES.md](../docs/RULES.md)

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.

---

## Contributing

This plugin is maintained as part of the AutoQA system for AI SaaS projects.

### Adding New Rules

1. Create rule file in `rules/` directory
2. Add rule to `index.js` imports and exports
3. Update version in `package.json`
4. Update this README.md
5. Update CHANGELOG.md
6. Update docs/RULES.md

---

## License

MIT

---

## Used By

- LogoSmith - AI Logo Design
- FashionForge - AI Fashion Design
- ClipMaster - AI Video Clips
- PetPortrait-AI - AI Pet Portraits
- PropVideo - AI Property Tours

---

**Version:** 1.8.1
**Last Updated:** 2025-11-22
**Total Rules:** 68
**Author:** AutoQA Team
