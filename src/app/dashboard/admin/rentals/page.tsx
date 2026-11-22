"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Eye,
} from "lucide-react";

import {
  getAdminBookings,
  getAdminPayments,
  type AdminBooking,
  type AdminPayment,
  type AdminPagination,
} from "@/lib/api/admin";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActiveTab = "bookings" | "payments";

const initialPagination: AdminPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

export default function AdminRentalsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("bookings");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [pagination, setPagination] = useState(initialPagination);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
    null,
  );

  const loadData = useCallback(
    async (refresh = false) => {
      try {
        refresh ? setRefreshing(true) : setLoading(true);
        setError("");

        if (activeTab === "bookings") {
          const result = await getAdminBookings({
            page,
            limit: 10,
            search,
          });

          setBookings(result.data || []);
          setPagination(result.pagination);
        } else {
          const result = await getAdminPayments({
            page,
            limit: 10,
            search,
          });

          setPayments(result.data || []);
          setPagination(result.pagination);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load rental records.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, page, search],
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");

      setSearch("");
      setPage(1);

      if (activeTab === "bookings") {
        const result = await getAdminBookings({
          page: 1,
          limit: 10,
          search: "",
        });

        setBookings(result.data || []);
        setPagination(result.pagination);
      } else {
        const result = await getAdminPayments({
          page: 1,
          limit: 10,
          search: "",
        });

        setPayments(result.data || []);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh rentals.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(
    () => ({
      bookings: pagination.total,
      confirmed: bookings.filter((item) =>
        ["confirmed", "approved"].includes((item.status || "").toLowerCase()),
      ).length,
      pending: bookings.filter(
        (item) => (item.status || "").toLowerCase() === "pending",
      ).length,
      payments: payments.length,
    }),
    [bookings, payments, pagination.total],
  );

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-BD", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  const formatMoney = (amount?: number) =>
    `৳${Number(amount || 0).toLocaleString("en-BD")}`;

  const statusStyle = (status?: string) => {
    const value = (status || "").toLowerCase();

    if (
      [
        "paid",
        "confirmed",
        "approved",
        "completed",
        "success",
        "succeeded",
      ].includes(value)
    ) {
      return "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";
    }

    if (["failed", "cancelled", "rejected", "refunded"].includes(value)) {
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  };

  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSelectedBooking(null);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              <ClipboardList size={15} /> Admin Dashboard
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">All Rentals</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Monitor rental bookings and payment records across RENTRO.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: stats.bookings,
            icon: ClipboardList,
          },
          {
            label: "Confirmed Bookings",
            value: stats.confirmed,
            icon: CalendarDays,
          },
          {
            label: "Pending Bookings",
            value: stats.pending,
            icon: CalendarDays,
          },
          { label: "Payment Records", value: stats.payments, icon: CreditCard },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="rounded-2xl border-border shadow-sm"
          >
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : stat.value}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-yellow-600">
                <stat.icon size={21} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold">Rental Management</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse booking and payment records.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder={
                    activeTab === "bookings"
                      ? "Search bookings..."
                      : "Search payments..."
                  }
                  className="h-10 rounded-xl pl-9"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              variant={activeTab === "bookings" ? "default" : "outline"}
              onClick={() => changeTab("bookings")}
              className={
                activeTab === "bookings"
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "rounded-xl"
              }
            >
              <ClipboardList size={16} className="mr-2" />
              Bookings
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "outline"}
              onClick={() => changeTab("payments")}
              className={
                activeTab === "payments"
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "rounded-xl"
              }
            >
              <CreditCard size={16} className="mr-2" />
              Payments
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="animate-spin text-yellow-500" size={30} />
              <p className="text-sm text-muted-foreground">
                Loading records...
              </p>
            </div>
          ) : activeTab === "bookings" ? (
            bookings.length === 0 ? (
              <div className="py-20 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <p className="font-semibold">No bookings found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Booking records will appear here.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Equipment</th>
                      <th className="px-5 py-4">Renter</th>
                      <th className="px-5 py-4">Owner</th>
                      <th className="px-5 py-4">Rental Period</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="transition hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold">
                            {booking.equipmentName || "Equipment booking"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            #{booking._id.slice(-8)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {booking.renterName || "Not available"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {booking.renterEmail || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {booking.ownerName || "Not available"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {booking.ownerEmail || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          <p>{formatDate(booking.startDate)}</p>
                          <p className="mt-1">
                            to {formatDate(booking.endDate)}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {formatMoney(booking.totalAmount)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant="outline"
                            className={`capitalize ${statusStyle(booking.status)}`}
                          >
                            {booking.status || "Unknown"}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Payment: {booking.paymentStatus || "Unknown"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedBooking(booking)}
                            className="size-9 rounded-lg hover:bg-yellow-400/10 hover:text-yellow-600"
                            title="View booking"
                          >
                            <Eye size={17} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : payments.length === 0 ? (
            <div className="py-20 text-center">
              <CreditCard
                size={32}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <p className="font-semibold">No payment records found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Payment records will appear here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-5 py-4">Booking ID</th>
                    <th className="px-5 py-4">Renter ID</th>
                    <th className="px-5 py-4">Owner ID</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold">
                          #{payment._id.slice(-8)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.stripeSessionId
                            ? "Stripe payment"
                            : "Payment record"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {payment.bookingId || "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {payment.renterId || "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {payment.ownerId || "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatMoney(payment.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`capitalize ${statusStyle(payment.paymentStatus)}`}
                        >
                          {payment.paymentStatus || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages || 1} ·{" "}
              {pagination.total} records
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Full rental booking information.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">
                    {selectedBooking.equipmentName || "Equipment booking"}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID: {selectedBooking._id}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize ${statusStyle(selectedBooking.status)}`}
                >
                  {selectedBooking.status || "Unknown"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Renter", selectedBooking.renterName || "Not available"],
                  [
                    "Renter Email",
                    selectedBooking.renterEmail || "Not available",
                  ],
                  ["Owner", selectedBooking.ownerName || "Not available"],
                  [
                    "Owner Email",
                    selectedBooking.ownerEmail || "Not available",
                  ],
                  ["Start Date", formatDate(selectedBooking.startDate)],
                  ["End Date", formatDate(selectedBooking.endDate)],
                  ["Total Amount", formatMoney(selectedBooking.totalAmount)],
                  [
                    "Payment Status",
                    selectedBooking.paymentStatus || "Unknown",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(selectedBooking.createdAt)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
