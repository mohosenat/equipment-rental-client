"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  UserRound,
  Package,
  Users,
  ClipboardList,
  Home,
  Settings,
  ChevronRight,
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { authClient, type AuthUser } from "@/lib/auth-client";

const customerLinks = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
  {
    label: "My Rentals",
    href: "/dashboard/customer/rentals",
    icon: CalendarDays,
  },
  { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
];

const ownerLinks = [
  { label: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
  {
    label: "Add Equipment",
    href: "/dashboard/owner/add-equipment",
    icon: Package,
  },
  {
    label: "My Equipment",
    href: "/dashboard/owner/my-equipment",
    icon: ClipboardList,
  },
  {
    label: "Rental Requests",
    href: "/dashboard/owner/rentals",
    icon: CalendarDays,
  },
];

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  {
    label: "Manage Equipment",
    href: "/dashboard/admin/equipment",
    icon: Package,
  },
  {
    label: "Manage Rentals",
    href: "/dashboard/admin/rentals",
    icon: CalendarDays,
  },
];

type UserRole = "customer" | "owner" | "admin";

function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const links =
    role === "owner"
      ? ownerLinks
      : role === "admin"
        ? adminLinks
        : customerLinks;

  const profileHref = `/dashboard/${role}/profile`;

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-20 items-center px-7">
        <Link href="/" className="text-3xl font-black tracking-tight">
          RENT<span className="text-yellow-500">RO</span>
        </Link>
      </div>

      <Separator />

      <div className="px-6 pb-3 pt-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                active
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={19} />
                {item.label}
              </span>

              {active && <ChevronRight size={17} />}
            </Link>
          );
        })}

        <Separator className="!my-5" />

        <p className="px-4 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Account
        </p>

        <Link
          href={profileHref}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            isActive(profileHref)
              ? "bg-yellow-400 text-black"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <UserRound size={19} />
          My Profile
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Home size={19} />
          Back to Website
        </Link>
      </nav>

      <div className="border-t border-border p-5">
        <div className="rounded-2xl bg-muted/70 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black">
            <Settings size={20} />
          </div>

          <p className="text-sm font-bold">Need assistance?</p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Have questions? Our team is here to help.
          </p>

          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold hover:text-yellow-600"
          >
            Contact Support <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = (user as AuthUser | undefined)?.role;

  const role: UserRole =
    userRole === "owner" || userRole === "admin" ? userRole : "customer";

  const dashboardTitle =
    role === "owner"
      ? "Owner Dashboard"
      : role === "admin"
        ? "Admin Dashboard"
        : "Customer Dashboard";

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-5 lg:hidden">
        <Link href="/" className="text-2xl font-black tracking-tight">
          RENT<span className="text-yellow-500">RO</span>
        </Link>

        <Sheet>
          <SheetTrigger
            className="rounded-lg border border-border p-2 transition hover:bg-muted"
            aria-label="Open dashboard menu"
          >
            <Menu size={21} />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[280px] border-border bg-card p-0"
          >
            <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>

            <DashboardSidebar role={role} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Dashboard Layout */}
      <div className="hidden lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="sticky top-0 h-screen w-[270px] border-r border-border bg-card">
          <DashboardSidebar role={role} />
        </aside>

        {/* Main Content */}
        <div className="min-w-0 w-full">
          <header className="flex h-20 items-center justify-between border-b border-border bg-background px-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                RENTRO Workspace
              </p>

              <h1 className="text-lg font-bold">{dashboardTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={19} />
                )}
              </div>

              <div>
                <p className="text-sm font-bold">
                  Welcome back{user?.name ? `, ${user.name}` : "!"}
                </p>

                <p className="text-xs capitalize text-muted-foreground">
                  {role} account
                </p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="w-full px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="w-full px-5 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
