"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Package,
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
  startDate: string;
  endDate: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
}

function formatDate(date: string) {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatAmount(amount: number) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "paid":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "completed":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    case "pending":
    case "unpaid":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

    case "cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "payment_review":
      return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
            Track all your equipment bookings, rental dates and payment details
            in one place.
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

      {/* Rental History */}
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-lg font-bold">Rental History</CardTitle>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Review all your equipment bookings.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
          >
            {bookings.length} Bookings
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
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                <Package size={26} />
              </div>

              <h3 className="text-lg font-semibold">No Rentals Yet</h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                You haven't booked any equipment yet. Explore available
                equipment and make your first rental.
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
                    <TableHead className="min-w-[210px] px-5 py-4 sm:px-6">
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
                      <TableCell className="px-5 py-4 sm:px-6">
                        <p className="max-w-[220px] text-sm font-semibold leading-snug">
                          {booking.equipmentName || "Equipment"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap text-sm">
                          {formatDate(booking.startDate)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap text-sm">
                          {formatDate(booking.endDate)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="whitespace-nowrap text-sm font-bold">
                          {formatAmount(booking.totalAmount)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(booking.paymentStatus)}`}
                        >
                          {formatStatus(booking.paymentStatus)}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 sm:px-6">
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}
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
    </div>
  );
}
