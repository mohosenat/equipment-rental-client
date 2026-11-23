"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Boxes,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/equipment" },
];

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const [currentSession, setCurrentSession] = useState(session);

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  useEffect(() => {
    const refreshAuthSession = async () => {
      const result = await authClient.getSession();
      setCurrentSession(result.data);
    };

    window.addEventListener("rentro-auth-change", refreshAuthSession);

    return () => {
      window.removeEventListener("rentro-auth-change", refreshAuthSession);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = currentSession?.user as
    | {
        name?: string;
        email?: string;
        role?: string;
      }
    | undefined;

  const isLoggedIn = !!currentSession;
  const role = user?.role?.toLowerCase();

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin/users"
      : role === "owner"
        ? "/dashboard/owner/my-equipment"
        : "/dashboard/customer/rentals";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      window.dispatchEvent(new Event("rentro-auth-change"));
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-[1350px] items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black shadow-sm transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
            <Boxes size={22} strokeWidth={2.3} />
          </span>

          <span className="text-[24px] font-black tracking-tight text-foreground">
            RENT<span className="text-yellow-500">RO</span>
            <span className="text-yellow-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-base font-semibold transition-colors duration-200 ${
                  active
                    ? "text-yellow-500"
                    : "text-muted-foreground hover:text-yellow-500"
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-yellow-400 after:transition-all after:duration-300 ${
                  active ? "after:w-full" : "after:w-0 hover:after:w-full"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-all hover:border-yellow-400 hover:bg-muted"
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {!isPending &&
            (isLoggedIn ? (
              <>
                <Link
                  href={dashboardHref}
                  className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-semibold text-foreground transition-all hover:bg-muted hover:text-yellow-600 dark:hover:text-yellow-400"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                  <ArrowUpRight
                    size={15}
                    className="opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-base font-bold text-black shadow-sm transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-base font-semibold text-foreground transition-colors hover:bg-muted hover:text-yellow-600 dark:hover:text-yellow-400"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-base font-bold text-black shadow-sm transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-yellow-400 hover:bg-muted"
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:border-yellow-400 hover:bg-muted"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border/70 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 sm:px-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 ${
                    active
                      ? "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {!isPending && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-base font-bold text-black transition-colors hover:bg-yellow-300"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl border border-border px-4 py-3 text-center text-base font-semibold transition-colors hover:bg-muted"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-base font-bold text-black transition-colors hover:bg-yellow-300"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 h-[76px] w-full border-b border-border bg-background" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
