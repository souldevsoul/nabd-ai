import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Valid internal routes for Vertex AI Services Marketplace
// Update this list when adding new pages
const VALID_ROUTES = [
  // Public routes
  "/",
  "/about",
  "/aml-policy",
  "/become-partner",
  "/blog",
  "/careers",
  "/contact",
  "/cookies",
  "/gallery",
  "/license-agreement",
  "/payments-policy",
  "/photographers",
  "/pricing",
  "/privacy",
  "/refund",
  "/request",
  "/specialists",
  "/tasks",
  "/terms",
  // Auth routes
  "/login",
  "/register",
  "/onboarding",
  // Dashboard routes
  "/dashboard",
  "/dashboard/photos/new",
  "/dashboard/purchases",
  "/dashboard/wallet",
  "/settings",
  // Executor routes
  "/executor",
  "/executor/telegram",
  // Admin routes
  "/admin",
  "/admin/assignments",
  "/admin/requests",
  "/admin/specialists",
  "/admin/users",
  // API routes (for signout etc)
  "/api/auth/signout",
];

// Dynamic route patterns (regex-like patterns for dynamic segments)
const VALID_DYNAMIC_PATTERNS = [
  "/blog/",           // /blog/[slug]
  "/careers/",        // /careers/[slug]
  "/marketplace/",    // /marketplace/[id]
  "/gallery/",        // Legacy - to be renamed
  "/specialist/",     // /specialist/[handle]
  "/photographer/",   // Legacy - to be renamed
  "/categories/",     // /categories/[slug]
];

// Custom ESLint rule to validate internal links
const internalLinksRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure internal links point to valid routes",
    },
    messages: {
      invalidRoute: "Invalid internal route '{{route}}'. This page does not exist. Valid routes: check VALID_ROUTES in eslint.config.mjs",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Only check href attributes
        if (node.name.name !== "href") return;

        // Get the value
        const value = node.value;
        if (!value) return;

        let href = null;

        // Handle string literals: href="/path"
        if (value.type === "Literal" && typeof value.value === "string") {
          href = value.value;
        }
        // Handle template literals: href={`/path`} (simple case without expressions)
        else if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral" &&
          value.expression.expressions.length === 0
        ) {
          href = value.expression.quasis[0].value.cooked;
        }

        if (!href) return;

        // Skip external links, anchors, mailto, tel, etc.
        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href === ""
        ) {
          return;
        }

        // Must be an internal link starting with /
        if (!href.startsWith("/")) return;

        // Remove query strings and hash for validation
        const cleanPath = href.split("?")[0].split("#")[0];

        // Check if it's a valid static route
        if (VALID_ROUTES.includes(cleanPath)) return;

        // Check if it matches a dynamic route pattern
        const matchesDynamic = VALID_DYNAMIC_PATTERNS.some(pattern =>
          cleanPath.startsWith(pattern) && cleanPath.length > pattern.length
        );
        if (matchesDynamic) return;

        // Special case: /api/* routes are generally valid
        if (cleanPath.startsWith("/api/")) return;

        // Report invalid route
        context.report({
          node,
          messageId: "invalidRoute",
          data: { route: cleanPath },
        });
      },
    };
  },
};

// Custom ESLint rule to ensure buttons have click handlers
const buttonMustBeClickableRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure all buttons have onClick handlers or are submit buttons",
    },
    messages: {
      missingHandler: "Button must have an onClick handler or be type='submit' in a form. Buttons must be functional.",
    },
  },
  create(context) {
    // Helper to check if node is inside a Link component
    function isInsideLink(node) {
      let parent = node.parent;
      while (parent) {
        if (parent.type === "JSXElement" && parent.openingElement) {
          const parentName = parent.openingElement.name.name ||
            (parent.openingElement.name.object && parent.openingElement.name.object.name);
          if (parentName === "Link" || parentName === "a") {
            return true;
          }
        }
        parent = parent.parent;
      }
      return false;
    }

    // Helper to check if node is inside a trigger component with asChild (shadcn pattern)
    function isInsideTriggerWithAsChild(node) {
      const triggerComponents = [
        "DropdownMenuTrigger", "SheetTrigger", "DialogTrigger",
        "PopoverTrigger", "AlertDialogTrigger", "TooltipTrigger",
        "AccordionTrigger", "CollapsibleTrigger", "SelectTrigger",
      ];
      let parent = node.parent;
      while (parent) {
        if (parent.type === "JSXElement" && parent.openingElement) {
          const parentName = parent.openingElement.name.name ||
            (parent.openingElement.name.object && parent.openingElement.name.object.name);
          if (triggerComponents.includes(parentName)) {
            // Check if this trigger has asChild attribute
            const hasAsChild = parent.openingElement.attributes.some(attr =>
              attr.type === "JSXAttribute" && attr.name.name === "asChild"
            );
            if (hasAsChild) {
              return true;
            }
          }
        }
        parent = parent.parent;
      }
      return false;
    }

    return {
      JSXOpeningElement(node) {
        // Check for button elements or Button components
        const name = node.name.name || (node.name.object && node.name.object.name);
        if (name !== "button" && name !== "Button") return;

        const attributes = node.attributes;

        // Check if it has onClick
        const hasOnClick = attributes.some(attr =>
          attr.type === "JSXAttribute" && attr.name.name === "onClick"
        );

        // Check if it's a submit button
        const isSubmit = attributes.some(attr =>
          attr.type === "JSXAttribute" &&
          attr.name.name === "type" &&
          attr.value &&
          attr.value.value === "submit"
        );

        // Check if it's wrapped in asChild (shadcn pattern)
        const hasAsChild = attributes.some(attr =>
          attr.type === "JSXAttribute" && attr.name.name === "asChild"
        );

        // Check if it's disabled
        const isDisabled = attributes.some(attr =>
          attr.type === "JSXAttribute" && attr.name.name === "disabled"
        );

        // Check if button is inside a Link component (navigation handled by Link)
        const insideLink = isInsideLink(node);

        // Check if button is inside a trigger component with asChild (shadcn pattern)
        const insideTrigger = isInsideTriggerWithAsChild(node);

        // Allow if has onClick, is submit, has asChild, is disabled, inside Link, or inside trigger
        if (hasOnClick || isSubmit || hasAsChild || isDisabled || insideLink || insideTrigger) return;

        context.report({
          node,
          messageId: "missingHandler",
        });
      },
    };
  },
};

// Custom ESLint rule to detect hardcoded text that should use i18n
// Warns when Arabic text or user-facing strings are hardcoded without t()
const noHardcodedTextRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Detect hardcoded text that should use the t() translation function",
    },
    messages: {
      hardcodedArabic: "Hardcoded Arabic text detected: '{{text}}'. Use t('key') from useTranslation() instead.",
      hardcodedText: "Potentially hardcoded user-facing text: '{{text}}'. Consider using t('key') from useTranslation().",
    },
  },
  create(context) {
    // Arabic character range
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // Skip patterns that are not user-facing text
    const skipPatterns = [
      /^[0-9.,\-+%$\s]+$/, // Pure numbers/punctuation
      /^#[0-9a-fA-F]{3,8}$/, // Hex colors
      /^\d+px$/, // CSS values
      /^[a-z\-_]+$/, // CSS class names, identifiers
      /^https?:\/\//, // URLs
      /^mailto:/, // Email links
      /^tel:/, // Phone links
      /^\/[a-z\-\/]*$/, // Route paths
      /^@/, // Social handles
      /^[A-Z_]{2,}$/, // Constants
    ];

    function shouldSkip(text) {
      const trimmed = text.trim();
      if (trimmed.length < 2) return true;
      return skipPatterns.some(pattern => pattern.test(trimmed));
    }

    function checkText(node, value) {
      if (typeof value !== "string") return;
      const trimmed = value.trim();
      if (shouldSkip(trimmed)) return;

      // Check for Arabic text
      if (arabicPattern.test(trimmed)) {
        const preview = trimmed.length > 40 ? trimmed.substring(0, 40) + "..." : trimmed;
        context.report({
          node,
          messageId: "hardcodedArabic",
          data: { text: preview },
        });
      }
    }

    return {
      // Check JSX text content (e.g., <span>Hello</span>)
      JSXText(node) {
        const trimmed = node.value.trim();
        if (trimmed.length > 0) {
          checkText(node, node.value);
        }
      },
      // Check string literals in JSX attributes that might be user-facing
      JSXAttribute(node) {
        // Only check certain attributes that might contain user-facing text
        const userFacingAttrs = ["title", "placeholder", "label", "aria-label", "alt"];
        if (!userFacingAttrs.includes(node.name.name)) return;

        if (node.value && node.value.type === "Literal" && typeof node.value.value === "string") {
          checkText(node, node.value.value);
        }
      },
    };
  },
};

// Custom ESLint rule to detect non-Arabic text (Kazakh/Cyrillic) in BURJ
// BURJ is Arabic-only site - no Kazakh or Russian allowed
const noKazakhTextRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Detect Kazakh/Cyrillic text that should be translated to Arabic",
    },
    messages: {
      kazakhDetected: "Kazakh/Cyrillic text detected: '{{text}}'. BURJ is Arabic-only - translate to Arabic.",
    },
  },
  create(context) {
    // Kazakh-specific Cyrillic characters: Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І (and lowercase)
    // Plus common Cyrillic: а-я, А-Я
    const kazakhPattern = /[ӘәҒғҚқҢңӨөҰұҮүҺһІіА-Яа-яЁё]/;

    function checkForKazakh(node, value) {
      if (typeof value !== "string") return;
      if (kazakhPattern.test(value)) {
        // Get a preview of the text (first 50 chars)
        const preview = value.length > 50 ? value.substring(0, 50) + "..." : value;
        context.report({
          node,
          messageId: "kazakhDetected",
          data: { text: preview },
        });
      }
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === "string") {
          checkForKazakh(node, node.value);
        }
      },
      // Check template literals
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          if (quasi.value.cooked) {
            checkForKazakh(node, quasi.value.cooked);
          }
        });
      },
      // Check JSX text
      JSXText(node) {
        checkForKazakh(node, node.value);
      },
    };
  },
};

// Custom ESLint rule to enforce ORBITA dark space theme
const orbitaDarkThemeRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce ORBITA dark space theme - forbid light backgrounds",
    },
    messages: {
      lightBackground: "ORBITA is a dark space-themed site. Use dark backgrounds like bg-background, bg-muted, or cosmic gradients instead of '{{className}}'",
    },
  },
  create(context) {
    // Light background classes to forbid
    const FORBIDDEN_CLASSES = [
      "bg-white",
      "bg-gray-50",
      "bg-gray-100",
      "bg-slate-50",
      "bg-slate-100",
      "from-white",
      "to-white",
      "via-white",
    ];

    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== "className") return;

        const value = node.value;
        if (!value) return;

        let classNames = null;

        // Handle string literals: className="..."
        if (value.type === "Literal" && typeof value.value === "string") {
          classNames = value.value;
        }
        // Handle template literals: className={`...`}
        else if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ) {
          // Concatenate all quasi values
          classNames = value.expression.quasis.map(q => q.value.cooked).join("");
        }

        if (!classNames) return;

        // Check for forbidden classes
        const classes = classNames.split(/\s+/);
        for (const cls of classes) {
          if (FORBIDDEN_CLASSES.includes(cls)) {
            context.report({
              node,
              messageId: "lightBackground",
              data: { className: cls },
            });
          }
        }
      },
    };
  },
};

// Custom plugin with BURJ rules
const vertexPlugin = {
  rules: {
    "valid-internal-links": internalLinksRule,
    "button-must-be-clickable": buttonMustBeClickableRule,
    "burj-dark-theme": orbitaDarkThemeRule,
    "no-kazakh-text": noKazakhTextRule,
    "no-hardcoded-text": noHardcodedTextRule,
  },
};

// ORBITA brand colors (hex values allowed in code)
// Cosmic Blue: #1E40AF
// Aurora Cyan: #38BDF8
// Dark Navy: #0F172A, #1E293B, #111827
// White: #FFFFFF, #FAFAFA
// Green (success): #10B981, #059669
const ALLOWED_HEX_COLORS = "1E40AF|38BDF8|0F172A|1E293B|111827|FFFFFF|FAFAFA|10B981|059669";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/**",
    // Exclude ESLint plugin (uses CommonJS)
    "eslint-plugin-product-quality/**",
  ]),
  // Disable warning-level rules globally
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  // Vertex brand enforcement rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Enforce consistent imports
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "Use components from @/components/ui instead of direct Radix imports",
            },
            {
              group: ["react-icons/!(ri)"],
              message: "VERTEX brand: Use Remix Icons from 'react-icons/ri' only. Import as: import { RiIconName } from 'react-icons/ri'",
            },
          ],
          paths: [
            {
              name: "lucide-react",
              message: "VERTEX brand: Use Remix Icons from 'react-icons/ri' instead of lucide-react. Import as: import { RiIconName } from 'react-icons/ri'",
            },
            {
              name: "next/image",
              message: "VERTEX brand: Use Remix Icons from 'react-icons/ri' for all visual elements. Import as: import { RiIconName } from 'react-icons/ri'",
            },
          ],
        },
      ],
      // Brand color and typography enforcement
      "no-restricted-syntax": [
        "error",
        {
          selector: `Literal[value=/^#(?!${ALLOWED_HEX_COLORS})[0-9A-Fa-f]{6}$/i]`,
          message: "Use Vertex brand colors from globals.css (gold, charcoal, white, black) instead of arbitrary hex values",
        },
        {
          selector: "VariableDeclarator[id.name=/mock|Mock|dummy|Dummy|fake|Fake/i]",
          message: "Mock/dummy/fake data is not allowed. All data must come from the API.",
        },
        {
          selector: "Identifier[name=/mock|Mock|dummy|Dummy|fake|Fake/i]",
          message: "Mock/dummy/fake identifiers are not allowed. Use real data from APIs.",
        },
        {
          selector: "Identifier[name=/enterprise|Enterprise|ENTERPRISE/]",
          message: "VERTEX brand: Do not use 'enterprise' terminology. Use alternatives like 'business', 'professional', 'premium', 'elite', or 'organization'.",
        },
        {
          selector: "Literal[value=/enterprise|Enterprise|ENTERPRISE/]",
          message: "VERTEX brand: Do not use 'enterprise' terminology. Use alternatives like 'business', 'professional', 'premium', 'elite', or 'organization'.",
        },
        {
          selector: "JSXAttribute[name.name='href'][value.value='#']",
          message: "Empty href='#' links are not allowed. Use a real route or remove the link.",
        },
        {
          selector: "JSXAttribute[name.name='href'][value.value=/^javascript:/]",
          message: "javascript: hrefs are not allowed. Use onClick handlers instead.",
        },
      ],
      // Enforce using cn() for className merging
      "no-template-curly-in-string": "off",
    },
  },
    // Component-specific rules
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: {
      // Ensure components have proper display names
      "react/display-name": "off",
      // Allow any in component props for flexibility
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Allow Radix imports in UI components (shadcn/ui wrapper components)
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Allow next/image in photo/gallery pages (actual image content, not icons)
  {
    files: [
      "app/gallery/**/*.{ts,tsx}",
      "app/photographer/**/*.{ts,tsx}",
      "app/photographers/**/*.{ts,tsx}",
      "app/blog/**/*.{ts,tsx}",
      "app/**/purchases/**/*.{ts,tsx}",
      "app/(admin)/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "Use components from @/components/ui instead of direct Radix imports",
            },
            {
              group: ["react-icons/!(ri)"],
              message: "VERTEX brand: Use Remix Icons from 'react-icons/ri' only. Import as: import { RiIconName } from 'react-icons/ri'",
            },
          ],
          paths: [
            {
              name: "lucide-react",
              message: "VERTEX brand: Use Remix Icons from 'react-icons/ri' instead of lucide-react. Import as: import { RiIconName } from 'react-icons/ri'",
            },
          ],
        },
      ],
    },
  },
  // Stricter rules for API routes
  {
    files: ["app/api/**/*.{ts,tsx}"],
    rules: {
      // Enforce error handling in API routes
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // Custom ORBITA validation rules
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      "vertex": vertexPlugin,
    },
    rules: {
      "vertex/valid-internal-links": "error",
      "vertex/button-must-be-clickable": "error",
      "vertex/burj-dark-theme": "error",
      // TODO: These rules are temporarily set to "warn" while i18n migration is in progress
      // They should be set back to "error" once all strings are extracted
      "vertex/no-kazakh-text": "warn",
      "vertex/no-hardcoded-text": "warn",
    },
  },
  // Three.js components - allow impure functions
  {
    files: ["components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "no-restricted-syntax": "off",
    },
  },
  // Test files - allow mock data and any types
  {
    files: ["tests/**/*.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
