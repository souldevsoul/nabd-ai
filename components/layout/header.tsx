"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  SlBag,
  SlSettings,
  SlLogout,
  SlUser,
  SlGrid,
  SlWallet,
} from "react-icons/sl";
import { RiMenuLine, RiCloseLine, RiHeartPulseLine, RiHeartLine } from "react-icons/ri";
import { useState } from "react";

interface HeaderProps {
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    roles: string[];
  } | null;
}

const navLinks = [
  { href: "/specialists", label: "المتخصصون" },
  { href: "/tasks", label: "الخدمات" },
  { href: "/request", label: "استشارة" },
  { href: "/pricing", label: "الأسعار" },
];

export function Header({ user: userProp }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Use passed user prop if available, otherwise use session
  const user = userProp || (session?.user ? {
    id: session.user.id as string,
    name: session.user.name || null,
    email: session.user.email || "",
    image: session.user.image || null,
    roles: (session.user as { roles?: string[] }).roles || [],
  } : null);

  const isActive = (href: string) => pathname === href;
  const isAdmin = user?.roles?.includes("ADMIN");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-primary/95 backdrop-blur-xl border-b border-accent/30 shadow-lg shadow-primary/20"
          : "bg-gradient-to-b from-primary/80 to-transparent backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Logo size="md" animated />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 absolute right-1/2 translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-5 py-2 text-sm tracking-wider uppercase transition-all duration-500 group",
                  isActive(link.href)
                    ? "text-accent font-bold"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 right-1/2 translate-x-1/2 h-0.5 bg-gradient-to-l from-accent to-primary transition-all duration-500",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
                {isActive(link.href) && (
                  <span className="absolute top-1/2 -left-2 w-1 h-1 bg-accent rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Dashboard quick access */}
                <Link href="/dashboard" className="hidden md:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-white/70 hover:text-accent hover:bg-white/10 tracking-wider uppercase text-xs border border-white/20"
                  >
                    <SlGrid size={14} />
                    <span className="hidden xl:inline">لوحة التحكم</span>
                  </Button>
                </Link>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-none ring-1 ring-border hover:ring-primary transition-all duration-500 p-0"
                    >
                      <Avatar className="h-10 w-10 rounded-none">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-display font-semibold rounded-none">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-none border-border bg-muted shadow-xl"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-display font-semibold tracking-wide">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer py-2.5">
                        <SlGrid className="ml-3 h-4 w-4 text-muted-foreground" />
                        <span className="tracking-wide">لوحة التحكم</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/wallet" className="cursor-pointer py-2.5">
                        <SlWallet className="ml-3 h-4 w-4 text-muted-foreground" />
                        <span className="tracking-wide">المحفظة</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/purchases" className="cursor-pointer py-2.5">
                        <SlBag className="ml-3 h-4 w-4 text-muted-foreground" />
                        <span className="tracking-wide">الطلبات</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer py-2.5">
                            <SlUser className="ml-3 h-4 w-4 text-muted-foreground" />
                            <span className="tracking-wide">لوحة الإدارة</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer py-2.5">
                        <SlSettings className="ml-3 h-4 w-4 text-muted-foreground" />
                        <span className="tracking-wide">الإعدادات</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/api/auth/signout" className="cursor-pointer py-2.5 text-destructive focus:text-destructive">
                        <SlLogout className="ml-3 h-4 w-4" />
                        <span className="tracking-wide">تسجيل الخروج</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="tracking-wider uppercase text-xs text-white/70 hover:text-white hover:bg-white/10"
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-l from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-display tracking-wider uppercase text-xs px-6 shadow-lg shadow-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/50"
                  >
                    <RiHeartPulseLine className="ml-2" size={14} />
                    انضم للمنصة
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  {mobileOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm border-r border-border bg-background p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile header */}
                  <div className="p-6 border-b border-border">
                    <Logo size="md" />
                  </div>

                  {/* Mobile nav */}
                  <nav className="flex-1 p-6">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block py-4 text-lg tracking-wider uppercase border-b border-border transition-all duration-300",
                            isActive(link.href)
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:pr-2"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile footer */}
                  {!user && (
                    <div className="p-6 border-t border-border space-y-3">
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                        <Button variant="outline" className="w-full tracking-wider uppercase text-xs rounded-none">
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="block">
                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground tracking-wider uppercase text-xs rounded-none">
                          <RiHeartLine className="ml-2" size={14} />
                          سجل الآن
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Heartbeat accent line */}
      <div className={cn(
        "h-0.5 transition-all duration-500",
        scrolled
          ? "bg-transparent"
          : "bg-gradient-to-l from-transparent via-accent/40 to-transparent"
      )} />
    </motion.header>
  );
}
