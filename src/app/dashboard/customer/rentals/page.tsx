import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  Wallet,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

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

const rentals = [
  {
    id: "RNT-1001",
    equipment: "Professional DSLR Camera",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    startDate: "Nov 22, 2026",
    endDate: "Nov 25, 2026",
    bookingDate: "Nov 18, 2026",
    amount: 4500,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    id: "RNT-1002",
    equipment: "Industrial Generator",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
    startDate: "Nov 24, 2026",
    endDate: "Nov 27, 2026",
    bookingDate: "Nov 19, 2026",
    amount: 7200,
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  },
  {
    id: "RNT-1003",
    equipment: "Excavator Machine",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1580901368919-7739efb0f5e0?w=400&q=80",
    startDate: "Oct 10, 2026",
    endDate: "Oct 15, 2026",
    bookingDate: "Oct 05, 2026",
    amount: 15000,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
  },
  {
    id: "RNT-1004",
    equipment: "Event Sound System",
    category: "Event Equipment",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    startDate: "Oct 20, 2026",
    endDate: "Oct 22, 2026",
    bookingDate: "Oct 16, 2026",
    amount: 3500,
    paymentStatus: "Paid",
    bookingStatus: "Cancelled",
  },
];

const summary = [
  {
    title: "Total Rentals",
    value: "04",
    description: "All your bookings",
    icon: Package,
    iconStyle: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Active Rentals",
    value: "01",
    description: "Currently ongoing",
    icon: Clock3,
    iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Completed",
    value: "01",
    description: "Successfully completed",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Total Spent",
    value: "৳30,200",
    description: "Across all bookings",
    icon: Wallet,
    iconStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
];

function getBookingBadge(status: string) {
  switch (status) {
    case "Confirmed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "Completed":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    case "Pending":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

    case "Cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getPaymentBadge(status: string) {
  return status === "Paid"
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
}

export default function MyRentalsPage() {
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
                    {item.value}
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
            {rentals.length} Bookings
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[260px] px-5 py-4 sm:px-6">
                    Equipment
                  </TableHead>

                  <TableHead className="min-w-[125px]">Rental Period</TableHead>

                  <TableHead className="min-w-[125px]">Booked On</TableHead>

                  <TableHead className="min-w-[120px]">Amount</TableHead>

                  <TableHead className="min-w-[115px]">Payment</TableHead>

                  <TableHead className="min-w-[130px]">
                    Booking Status
                  </TableHead>

                  <TableHead className="min-w-[120px] px-5 text-right sm:px-6">
                    Booking ID
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rentals.map((rental) => (
                  <TableRow
                    key={rental.id}
                    className="border-border/60 transition-colors hover:bg-muted/30"
                  >
                    {/* Equipment */}
                    <TableCell className="px-5 py-4 sm:px-6">
                      <div className="flex min-w-[230px] items-center gap-3">
                        <div className="h-[60px] w-[70px] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                          <img
                            src={rental.image}
                            alt={rental.equipment}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug">
                            {rental.equipment}
                          </p>

                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {rental.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Rental Period */}
                    <TableCell>
                      <div className="space-y-1.5 text-xs">
                        <p className="font-medium text-foreground">
                          {rental.startDate}
                        </p>

                        <p className="text-muted-foreground">
                          to {rental.endDate}
                        </p>
                      </div>
                    </TableCell>

                    {/* Booking Date */}
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {rental.bookingDate}
                      </span>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <span className="text-sm font-bold">
                        ৳{rental.amount.toLocaleString("en-BD")}
                      </span>
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadge(rental.paymentStatus)}`}
                      >
                        {rental.paymentStatus}
                      </Badge>
                    </TableCell>

                    {/* Booking Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getBookingBadge(rental.bookingStatus)}`}
                      >
                        {rental.bookingStatus}
                      </Badge>
                    </TableCell>

                    {/* Booking ID */}
                    <TableCell className="px-5 text-right sm:px-6">
                      <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                        {rental.id}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Explore Equipment
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Demo Notice */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Showing sample rental records for frontend development. Your actual
        booking history will appear after API integration.
      </p>
    </div>
  );
}
