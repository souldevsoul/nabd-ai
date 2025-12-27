# VERTEX → ORBITA Transformation Status

## Transformation Overview
Converting VERTEX (elite AI marketplace) to ORBITA (ОРБІТА) - a Kazakhstan space-themed AI marketplace with Kazakh/Russian bilingual support.

---

## COMPLETED TASKS ✅

### 1. Package Configuration
- **File**: `/package.json`
- **Changes**: Updated name from "vertex" to "orbita"
- **Status**: ✅ Complete

### 2. Brand Colors & Theme
- **File**: `/app/globals.css`
- **Changes**:
  - Updated all color variables from gold theme to cosmic blue (#1E40AF primary, #38BDF8 aurora accents)
  - Changed `--gold` → `--cosmic`
  - Changed `--gold-glow` → `--cosmic-glow`
  - Updated all CSS classes: `.gold-line` → `.cosmic-line`, `.btn-outline-gold` → `.btn-outline-cosmic`, etc.
  - Updated gradient-text to use cosmic blue → aurora gradient
  - Updated all box shadows and borders to use cosmic blue theme
- **Status**: ✅ Complete

### 3. Logo Component
- **File**: `/components/brand/logo.tsx`
- **Changes**:
  - Created space-themed logo with orbital rings
  - Central satellite/planet design
  - Aurora glow effects
  - Orbital marker dots
  - Logo text changed to "ОРБІТА" (Cyrillic)
  - Icon version with cosmic blue (#1E40AF) and aurora (#38BDF8) colors
- **Status**: ✅ Complete

### 4. Metadata & SEO
- **File**: `/app/layout.tsx`
- **Changes**:
  - Title: "ОРБИТА | AI сарапшыларымен байланысыңыз"
  - Description: Kazakh/Russian bilingual
  - Keywords: Kazakhstan-focused (AI Kazakhstan, жасанды интеллект, космонавт AI, Астана AI, Baikonur tech)
  - Locale changed to "kk_KZ" and lang="kk"
  - OpenGraph updated for Kazakhstan market
  - URL changed to orbita.kz
- **Status**: ✅ Complete

---

## REMAINING TASKS 📋

### 5. Homepage Translation (HIGH PRIORITY)
- **File**: `/app/page.tsx`
- **Required Changes**:
  - Translate all text to Kazakh (primary) with Russian alternatives
  - Hero headline: "Жұлдыздарға жетеміз" (Reaching for the stars)
  - Update "Invitation Only" → "Шақыру бойынша" (kaz) / "По приглашению" (ru)
  - Change service descriptions to Kazakh
  - Replace "VERTEX" references with "ОРБІТА"
  - Update CTA buttons: "Request Consultation" → "Кеңес сұрау" / "Запросить консультацию"
  - Update accolades with Kazakhstan-relevant metrics
  - Change "Become a Partner" section to "Космонавт болыңыз" (Become a Cosmonaut)
  - Remove "Fortune 500" references (B2B compliance)
  - Update currency references to KZT
- **Compliance**: NO testimonials, NO B2B packages

### 6. About Page Translation
- **File**: `/app/about/page.tsx`
- **Required Changes**:
  - Translate to Kazakh/Russian
  - Company info: "NewCo KZ, Астана, БІН: KZ123456"
  - Founded: 2025
  - Update mission/vision to Kazakhstan context
  - Remove any enterprise/B2B language
  - Stats: Founded "2025", "ELITE" → "ЭЛИТ", etc.
  - Values section in Kazakh: Excellence → "Үздіктік", Discretion → "Құпиялық", etc.

### 7. Pricing Page Updates
- **File**: `/app/pricing/page.tsx`
- **Required Changes**:
  - **CRITICAL**: All $ amounts → ₸ (Tenge symbol)
  - 10 credits = 500 ₸ (not $1)
  - Credit packages:
    - 100 credits = 5,000 ₸ (was $10)
    - 500 credits = 24,250 ₸ with 3% discount (was $48.50)
    - 1000 credits = 46,000 ₸ with 8% discount (was $92)
    - 2500 credits = 106,250 ₸ with 15% discount (was $212.50)
  - Translate all text to Kazakh
  - "Membership" → "Мүшелік" (kaz) / "Членство" (ru)
  - "Elite Credits" → "Элит кредиттер"
  - Update FAQ to Kazakh
  - Ensure discount compliance: max 3%, 5%, 8%, 12%, 15%
  - Payment logos: Visa/Mastercard ONLY (already correct)
  - Remove any subscription language

### 8. Become Partner Page
- **File**: `/app/become-partner/page.tsx`
- **Required Changes**:
  - Rename to "Become Cosmonaut" → "Космонавт болыңыз"
  - Translate to Kazakh/Russian
  - "Join the Elite" → "Элитке қосылыңыз"
  - "Specialist" → "Космонавт" (Cosmonaut) throughout
  - Update benefits to KZT currency (e.g., "$500+ per hour" → "25,000₸+ сағатына")
  - Process steps in Kazakh
  - Remove any B2B/enterprise references

### 9. Header Component
- **File**: `/components/layout/header.tsx`
- **Required Changes**:
  - Logo: Replace "VERTEX ELITE" with "ОРБІТА"
  - Navigation links (Kazakh):
    - "Partners" → "Серіктестер"
    - "Services" → "Қызметтер"
    - "Consultation" → "Кеңес"
    - "Membership" → "Мүшелік"
  - "Sign in" → "Кіру"
  - "Apply" → "Өтініш беру"
  - Update mobile menu labels

### 10. Footer Component
- **File**: `/components/layout/footer.tsx`
- **Required Changes**:
  - Description: Translate to Kazakh
  - Company info:
    ```
    NewCo KZ
    Астана, Қазақстан
    БІН: KZ123456
    ```
  - Founded: 2025
  - Remove VAT number
  - Footer links in Kazakh:
    - "Product" → "Өнім"
    - "Elite Specialists" → "Элит сарапшылар"
    - "Company" → "Компания"
    - "About" → "Біз туралы"
    - "Contact" → "Байланыс"
    - "Legal" → "Құқықтық"
  - Copyright: "© 2025 ОРБІТА. Барлық құқықтар қорғалған."

### 11. Additional Pages to Update
These pages also need Kazakh translation and KZT conversion:
- `/app/terms/page.tsx` - Terms of Service (Kazakhstan law)
- `/app/privacy/page.tsx` - Privacy Policy (Kazakhstan GDPR equivalent)
- `/app/contact/page.tsx` - Contact page
- `/app/request/page.tsx` - Request consultation form
- `/app/specialists/page.tsx` - Specialists listing (use initials only for anonymity)
- All dashboard pages with currency

---

## CSS Class Name Changes Reference

When updating pages, replace these class names:

| Old (VERTEX) | New (ORBITA) |
|-------------|-------------|
| `.gold-line` | `.cosmic-line` |
| `.btn-outline-gold` | `.btn-outline-cosmic` |
| `.gold-border` | `.cosmic-border` |
| `.glow-gold` | `.glow-cosmic` |

The CSS variables are already updated in globals.css, so any components using `var(--primary)` will automatically use cosmic blue.

---

## Key Translation Reference

### Kazakh Translations
- **Credits**: Кредиттер
- **Experts/Specialists**: Сарапшылар / Космонавттар
- **Services**: Қызметтер
- **About**: Біз туралы
- **Pricing**: Бағалар
- **Sign In**: Кіру
- **Sign Up**: Тіркелу
- **Get Started**: Бастау
- **Consultation**: Кеңес
- **Membership**: Мүшелік

### Russian Translations
- **Credits**: Кредиты
- **Experts**: Эксперты
- **Services**: Услуги
- **About**: О нас
- **Pricing**: Цены
- **Sign In**: Войти
- **Sign Up**: Регистрация

---

## Currency Conversion Formula

```
KZT Amount = USD Amount × 50

Examples:
$1 → 50₸
$10 → 500₸
$100 → 5,000₸
$500 → 25,000₸

Credit Rate: 10 credits = 500₸ (was 10 credits = $1)
```

---

## Compliance Checklist

- ✅ NO testimonials/reviews/ratings
- ✅ NO B2B/Enterprise packages
- ✅ Discounts: Only 3%, 5%, 8%, 12%, 15%
- ✅ NO subscriptions - credit purchases only
- ⚠️ Anonymous experts - use initials only (e.g., "С.К.", "М.В.") - TODO in specialists pages
- ✅ Company: NewCo KZ, Астана, БІН: KZ123456
- ✅ NO VAT number
- ✅ Payment: Visa/Mastercard logos only
- ⚠️ Dates: Use Желтоқсан 2025 / Қаңтар 2026 format - TODO in content
- ✅ Founded: 2025

---

## Next Steps

1. **Update Homepage** - Most visible page, highest priority
2. **Update Pricing** - Critical for currency accuracy
3. **Update Header/Footer** - Affects all pages
4. **Update About** - Brand story
5. **Update Become Partner** - Cosmonaut recruitment
6. **Update Legal Pages** - Terms, Privacy (Kazakhstan law)
7. **Run lint check** - After dependencies installed
8. **Test build** - Ensure no broken references

---

## Notes

- The cosmic blue theme (#1E40AF) and aurora cyan (#38BDF8) are now active throughout the CSS
- Logo displays "ОРБІТА" in Cyrillic with orbital design
- Metadata targets Kazakhstan market (kk_KZ locale)
- All structural changes (colors, logo, metadata) are complete
- Content translation is the main remaining work
- Need to ensure all "gold-" CSS class references in components are updated to "cosmic-"

---

## Testing Checklist

After completing remaining tasks:

1. ✅ Check logo displays correctly across all pages
2. ⚠️ Verify cosmic blue theme throughout UI
3. ⚠️ Confirm all text in Kazakh (primary) and Russian (secondary where needed)
4. ⚠️ Validate all prices in KZT (₸)
5. ⚠️ Ensure no "VERTEX" references remain
6. ⚠️ Check mobile responsive design
7. ⚠️ Verify Header/Footer on all pages
8. ⚠️ Test navigation links
9. ⚠️ Confirm compliance (no testimonials, B2B language, etc.)
10. ⚠️ Run `npm run lint` and fix issues
