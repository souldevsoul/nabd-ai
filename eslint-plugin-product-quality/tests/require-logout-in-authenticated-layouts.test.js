/**
 * Tests for require-logout-in-authenticated-layouts rule
 */

const { RuleTester } = require('eslint');
const rule = require('../rules/require-logout-in-authenticated-layouts');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('require-logout-in-authenticated-layouts', rule, {
  valid: [
    // Dashboard layout with signOut from next-auth
    {
      code: `
        import { signOut } from "next-auth/react";
        import { Header } from "@/components/Header";

        export default function DashboardLayout({ children }) {
          return (
            <div>
              <Header />
              <button onClick={() => signOut()}>Logout</button>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
    },
    // Admin layout with logout button
    {
      code: `
        import { signOut } from "next-auth/react";

        export default function AdminLayout({ children }) {
          return (
            <div>
              <aside>
                <nav>Admin Nav</nav>
                <button onClick={() => signOut()}>Sign Out</button>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
    // Layout using shared Header component (assumed to have logout)
    {
      code: `
        import { Header } from "@/components/marketing/layout/header";

        export default function DashboardLayout({ children }) {
          return (
            <div>
              <Header />
              {children}
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
    },
    // Layout using AppHeader (assumed to have logout)
    {
      code: `
        import { AppHeader } from "@/components/AppHeader";

        export default function StudioLayout({ children }) {
          return (
            <div>
              <AppHeader />
              {children}
            </div>
          );
        }
      `,
      filename: '/app/studio/layout.tsx',
    },
    // Layout using app-header path (kebab-case import)
    {
      code: `
        import { AppHeader } from "@/components/marketing/layout/app-header";

        export default function DashboardLayout({ children }) {
          return (
            <div className="min-h-screen">
              <AppHeader />
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
    },
    // Layout using AdminSidebar (assumed to have logout)
    {
      code: `
        import { AdminSidebar } from "@/components/admin/AdminSidebar";

        export default function AdminLayout({ children }) {
          return (
            <div className="flex">
              <AdminSidebar />
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
    // Header component WITH signOut - should pass
    {
      code: `
        import { signOut } from "next-auth/react";

        export function AppHeader({ user }) {
          return (
            <header>
              {user && <button onClick={() => signOut()}>Logout</button>}
            </header>
          );
        }
      `,
      filename: '/components/marketing/layout/app-header.tsx',
    },
    // Root layout (should not require logout)
    {
      code: `
        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          );
        }
      `,
      filename: '/app/layout.tsx',
    },
    // Non-authenticated page layout
    {
      code: `
        export default function BlogLayout({ children }) {
          return <div>{children}</div>;
        }
      `,
      filename: '/app/blog/layout.tsx',
    },
    // Layout with logout in onClick text
    {
      code: `
        export default function AdminLayout({ children }) {
          const handleLogout = () => {};
          return (
            <div>
              <aside>
                <button onClick={handleLogout}>Log out</button>
              </aside>
              {children}
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
    },
    // Specialist layout with signOut import
    {
      code: `
        import { signOut } from "next-auth/react";

        export default function SpecialistLayout({ children }) {
          return (
            <div className="flex min-h-screen">
              <aside className="w-64">
                <nav>Navigation</nav>
                <button onClick={() => signOut({ callbackUrl: '/' })}>
                  Logout
                </button>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/specialist/layout.tsx',
    },
    // Layout with Navbar import (assumed to have logout)
    {
      code: `
        import { Navbar } from "@/components/Navbar";

        export default function PortalLayout({ children }) {
          return (
            <div>
              <Navbar />
              {children}
            </div>
          );
        }
      `,
      filename: '/app/portal/layout.tsx',
    },
  ],

  invalid: [
    // Admin layout without any logout
    {
      code: `
        import Link from "next/link";

        export default function AdminLayout({ children }) {
          return (
            <div className="flex min-h-screen">
              <aside className="w-64">
                <div className="h-16">Admin Portal</div>
                <nav>
                  <Link href="/admin">Dashboard</Link>
                  <Link href="/admin/users">Users</Link>
                </nav>
                <Link href="/dashboard">Switch to User</Link>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/admin/layout.tsx',
      errors: [{ messageId: 'missingLogout' }],
    },
    // Specialist layout without logout
    {
      code: `
        import Link from "next/link";
        import { Text, Heading } from "@/components/ui/typography";

        export default function SpecialistLayout({ children }) {
          return (
            <div className="flex min-h-screen">
              <aside className="w-64">
                <Heading>Specialist Portal</Heading>
                <nav>
                  <Link href="/specialist">Dashboard</Link>
                  <Link href="/specialist/projects">Projects</Link>
                </nav>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/specialist/layout.tsx',
      errors: [{ messageId: 'missingLogout' }],
    },
    // Dashboard layout with custom sidebar but no logout
    {
      code: `
        export default function DashboardLayout({ children }) {
          return (
            <div className="flex">
              <aside>
                <nav>
                  <a href="/dashboard">Home</a>
                  <a href="/dashboard/settings">Settings</a>
                </nav>
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/dashboard/layout.tsx',
      errors: [{ messageId: 'missingLogout' }],
    },
    // Studio layout missing logout
    {
      code: `
        import { Navigation } from "@/components/studio/Navigation";

        export default function StudioLayout({ children }) {
          return (
            <div>
              <aside>
                <Navigation />
              </aside>
              <main>{children}</main>
            </div>
          );
        }
      `,
      filename: '/app/studio/layout.tsx',
      errors: [{ messageId: 'missingLogout' }],
    },
    // Header component with user prop but NO signOut
    {
      code: `
        export function AppHeader({ user }) {
          return (
            <header>
              {user && <span>Welcome, {user.name}</span>}
              <button>Logout</button>
            </header>
          );
        }
      `,
      filename: '/components/marketing/layout/app-header.tsx',
      errors: [{ messageId: 'headerMissingLogout' }],
    },
  ],
});

console.log('All require-logout-in-authenticated-layouts tests passed!');
