/**
 * Tests for require-logo-component-in-layouts rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/require-logo-component-in-layouts');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('require-logo-component-in-layouts', rule, {
  valid: [
    // Layout using Logo component
    {
      code: `
        import { Logo } from "@/components/shared/Logo";

        export default function AdminLayout({ children }) {
          return (
            <div className="flex">
              <aside>
                <Logo />
                <nav>Navigation</nav>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
    // Layout using BrandLogo
    {
      code: `
        import { BrandLogo } from "@/components/BrandLogo";

        export default function DashboardLayout({ children }) {
          return (
            <div>
              <header>
                <BrandLogo />
              </header>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
    },
    // Layout with no branding (just content)
    {
      code: `
        export default function AuthLayout({ children }) {
          return <>{children}</>;
        }
      `,
      filename: '/app/auth/layout.tsx',
    },
    // Layout with generic text (not a brand name)
    {
      code: `
        export default function AdminLayout({ children }) {
          return (
            <div>
              <aside>
                <h2>Admin Dashboard</h2>
                <nav>Links</nav>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
    // Layout using AppLogo
    {
      code: `
        import { AppLogo } from "@/components/ui/AppLogo";

        export default function SpecialistLayout({ children }) {
          return (
            <div className="flex">
              <aside>
                <AppLogo />
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/specialist/layout.tsx',
    },
    // Not a layout file
    {
      code: `
        export default function AdminPage() {
          return <div>PropVideo Admin</div>;
        }
      `,
      filename: '/app/admin/page.tsx',
    },
    // Generic descriptive text is fine
    {
      code: `
        export default function Layout({ children }) {
          return (
            <div>
              <aside>
                <div>ADMIN PORTAL</div>
                <div>Platform Management</div>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
  ],

  invalid: [
    // Hardcoded brand name in sidebar
    {
      code: `
        export default function AdminLayout({ children }) {
          return (
            <div className="flex">
              <aside>
                <Heading>PropVideo</Heading>
                <nav>Navigation</nav>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
    // Hardcoded brand with Pro suffix
    {
      code: `
        export default function SpecialistLayout({ children }) {
          return (
            <div className="flex">
              <aside>
                <h2>BookTrailerPro</h2>
                <nav>Links</nav>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/specialist/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
    // Brand name with AI suffix
    {
      code: `
        export default function DashboardLayout({ children }) {
          return (
            <div>
              <aside>
                <Heading>TutorBotAI</Heading>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
    // Brand with Hub suffix
    {
      code: `
        export default function AdminLayout({ children }) {
          return (
            <div>
              <aside>
                <Title>DataHub</Title>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
    // Brand with Forge suffix
    {
      code: `
        export default function StudioLayout({ children }) {
          return (
            <div>
              <aside>
                <h1>LogoForge</h1>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/studio/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
    // Brand with common prefix
    {
      code: `
        export default function AdminLayout({ children }) {
          return (
            <div>
              <aside>
                <Heading>AutoQuiz</Heading>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
      errors: [{ messageId: 'hardcodedBrand' }],
    },
  ],
});

console.log('All require-logo-component-in-layouts tests passed!');
