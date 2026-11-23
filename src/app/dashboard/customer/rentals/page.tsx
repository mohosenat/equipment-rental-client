"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  image?: string;
  category?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
}

function formatDate(date: string) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function getBookingBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "completed":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    case "pending":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

    case "cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "payment_review":
      return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getPaymentBadge(status: string) {
  return status?.toLowerCase() === "paid"
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAmount(amount: number) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

export default function MyRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Please log in to view your rentals.");
        }

        const response = await fetch(`${API_URL}/bookings/my-bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load your rentals.");
        }

        setBookings(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  // Dynamic Summary
  const totalRentals = bookings.length;

  const activeRentals = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "in_progress",
  ).length;

  const completedRentals = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed",
  ).length;

  const totalSpent = bookings.reduce((total, booking) => {
    return booking.paymentStatus?.toLowerCase() === "paid"
      ? total + Number(booking.totalAmount || 0)
      : total;
  }, 0);

  const summary = [
    {
      title: "Total Rentals",
      value: String(totalRentals).padStart(2, "0"),
      description: "All your bookings",
      icon: Package,
      iconStyle: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Active Rentals",
      value: String(activeRentals).padStart(2, "0"),
      description: "Currently ongoing",
      icon: Clock3,
      iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: String(completedRentals).padStart(2, "0"),
      description: "Successfully completed",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Spent",
      value: formatAmount(totalSpent),
      description: "Across paid bookings",
      icon: Wallet,
      iconStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="mx-auto w-full space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
              <CalendarDays size={16} />
            </span>
            Customer Workspace
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Rentals
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Keep track of your bookings, rental dates and payment details all in
            one place.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-500"
        >
          <Package size={17} />
          Browse Equipment
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="group rounded-2xl border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {loading ? (
                      <span className="inline-block h-8 w-12 animate-pulse rounded-md bg-muted" />
                    ) : (
                      item.value
                    )}
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rental History */}
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-lg font-bold">Rental History</CardTitle>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Review all your recent equipment bookings.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
          >
            {loading ? "Loading..." : `${bookings.length} Bookings`}
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Loading your rentals...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 px-5 text-center">
              <p className="text-sm font-medium text-red-500">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />

              <h3 className="text-lg font-semibold">No Rentals Yet</h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your equipment booking history will appear here after your first
                booking.
              </p>

              <Link
                href="/equipment"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-semibold text-black transition hover:bg-yellow-500"
              >
                Explore Equipment
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[260px] px-5 py-4 sm:px-6">
                      Equipment Name
                    </TableHead>

                    <TableHead className="min-w-[145px]">
                      Rental Start Date
                    </TableHead>

                    <TableHead className="min-w-[145px]">
                      Rental End Date
                    </TableHead>

                    <TableHead className="min-w-[135px]">
                      Booking Date
                    </TableHead>

                    <TableHead className="min-w-[120px]">
                      Total Amount
                    </TableHead>

                    <TableHead className="min-w-[120px]">
                      Payment Status
                    </TableHead>

                    <TableHead className="min-w-[135px] px-5 sm:px-6">
                      Booking Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="border-border/60 transition-colors hover:bg-muted/30"
                    >
                      {/* Equipment */}
                      <TableCell className="px-5 py-4 sm:px-6">
                        <div className="flex min-w-[230px] items-center gap-3">
                          <div className="flex h-[60px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted">
                            {booking.equipmentImage || booking.image ? (
                              <img
                                src={booking.equipmentImage || booking.image}
                                alt={booking.equipmentName || "Equipment"}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug">
                              {booking.equipmentName || "Equipment"}
                            </p>

                            {booking.category && (
                              <p className="mt-1.5 text-xs text-muted-foreground">
                                {booking.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Rental Start Date */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm font-medium text-foreground">
                          {formatDate(booking.startDate)}
                        </span>
                      </TableCell>

                      {/* Rental End Date */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(booking.endDate)}
                        </span>
                      </TableCell>

                      {/* Booking Date */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </span>
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm font-bold">
                          {formatAmount(booking.totalAmount)}
                        </span>
                      </TableCell>

                      {/* Payment Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadge(booking.paymentStatus)}`}
                        >
                          {formatStatus(booking.paymentStatus)}
                        </Badge>
                      </TableCell>

                      {/* Booking Status */}
                      <TableCell className="px-5 sm:px-6">
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getBookingBadge(booking.status)}`}
                        >
                          {formatStatus(booking.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Note */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Looking for your next rental?</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore equipment and find the right tools for your project.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Explore Equipment
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
