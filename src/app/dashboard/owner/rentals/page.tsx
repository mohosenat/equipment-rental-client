"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  Eye,
  RefreshCw,
  CalendarDays,
  Loader2,
  X,
  Boxes,
  Clock,
  CheckCircle2,
  XCircle,
  UserRound,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";

import {
  OwnerRentalBooking,
  getMyRentalBookings,
  updateOwnerBookingStatus,
} from "@/lib/api/owner-bookings";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export default function MyEquipmentRentalPage() {
  const [bookings, setBookings] = useState<OwnerRentalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] =
    useState<OwnerRentalBooking | null>(null);

  const [updatingId, setUpdatingId] = useState("");

  // Load owner bookings
  const loadBookings = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getMyRentalBookings();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load rental bookings.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Search and filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (booking.equipmentName || "").toLowerCase().includes(searchText) ||
        (booking.renterName || "").toLowerCase().includes(searchText) ||
        (booking.renterEmail || "").toLowerCase().includes(searchText) ||
        booking._id.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || booking.status.toLowerCase() === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        booking.paymentStatus.toLowerCase() === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(
        (booking) => booking.status.toLowerCase() === "pending",
      ).length,
      approved: bookings.filter(
        (booking) => booking.status.toLowerCase() === "approved",
      ).length,
      completed: bookings.filter(
        (booking) => booking.status.toLowerCase() === "completed",
      ).length,
    };
  }, [bookings]);

  // Status styles
  const getBookingStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "confirmed":
        return "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";

      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

      case "completed":
        return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

      case "cancelled":
        return "border-muted bg-muted text-muted-foreground";

      default:
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";

      case "failed":
        return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

      case "refunded":
        return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

      default:
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle booking status update
  const handleStatusUpdate = async (
    booking: OwnerRentalBooking,
    newStatus: "approved" | "rejected",
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus} this rental request?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(booking._id);
      setError("");
      setSuccess("");

      await updateOwnerBookingStatus(booking._id, newStatus);

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id ? { ...item, status: newStatus } : item,
        ),
      );

      if (selectedBooking?._id === booking._id) {
        setSelectedBooking({
          ...booking,
          status: newStatus,
        });
      }

      setSuccess(`Rental request ${newStatus} successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update rental status.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Open booking details
  const openDetails = (booking: OwnerRentalBooking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              <Package size={15} />
              Owner Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              My Equipment Rental
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Manage rental requests for your equipment, review customer
              information, and track booking and payment status.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-400/10">
              <Boxes size={20} className="text-yellow-400" />
            </div>

            <div>
              <p className="text-xs text-white/50">Total Rental Requests</p>
              <p className="text-xl font-bold">{loading ? "—" : stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Rentals",
            value: stats.total,
            icon: Package,
            color: "text-foreground",
          },
          {
            label: "Pending Requests",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-600 dark:text-yellow-400",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: Boxes,
            color: "text-blue-600 dark:text-blue-400",
          },
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

                <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                  {loading ? "—" : stat.value}
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <stat.icon size={21} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <p>{error}</p>

          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <p>{success}</p>

          <button onClick={() => setSuccess("")} aria-label="Dismiss message">
            <X size={17} />
          </button>
        </div>
      )}

      {/* Rental Table */}
      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Rental Requests
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Review and manage all rental requests for your equipment.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rentals..."
                  className="h-10 rounded-xl pl-9"
                />
              </div>

              {/* Booking Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as BookingStatusFilter)
                }
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              >
                <option value="all">All Booking Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Refresh */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => loadBookings(true)}
                disabled={refreshing}
                className="shrink-0 rounded-xl"
                title="Refresh bookings"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="animate-spin text-yellow-500" size={30} />

              <p className="text-sm text-muted-foreground">
                Loading rental requests...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Package size={29} className="text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {bookings.length === 0
                  ? "No rental requests yet"
                  : "No matching rental requests"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {bookings.length === 0
                  ? "Rental requests for your equipment will appear here when customers book your listings."
                  : "Try changing your search term or filters to find rental requests."}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>

                    <th className="px-5 py-4 font-semibold">Equipment</th>

                    <th className="px-5 py-4 font-semibold">Rental Duration</th>

                    <th className="px-5 py-4 font-semibold">Quantity</th>

                    <th className="px-5 py-4 font-semibold">Booking Amount</th>

                    <th className="px-5 py-4 font-semibold">Payment</th>

                    <th className="px-5 py-4 font-semibold">Booking Status</th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-muted/30"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/10">
                            <UserRound
                              size={18}
                              className="text-yellow-600 dark:text-yellow-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate font-semibold text-foreground">
                              {booking.renterName ||
                                booking.renterEmail ||
                                "Customer"}
                            </p>

                            <p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
                              {booking.renterEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Equipment */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            {booking.equipmentImage ? (
                              <img
                                src={booking.equipmentImage}
                                alt={booking.equipmentName}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center">
                                <Package
                                  size={20}
                                  className="text-muted-foreground"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate font-semibold text-foreground">
                              {booking.equipmentName}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              ID: {booking.equipmentId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {booking.rentalDuration}{" "}
                            <span className="capitalize text-muted-foreground">
                              {booking.rentalType}
                            </span>
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatDate(booking.startDate)} -{" "}
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
                          <Boxes size={15} className="text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {booking.quantity}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            units
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-foreground">
                          {formatPrice(booking.totalAmount)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatPrice(booking.pricePerUnit)} /{" "}
                          {booking.rentalType}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 capitalize ${getPaymentStatusStyle(booking.paymentStatus)}`}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </td>

                      {/* Booking Status */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 capitalize ${getBookingStatusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(booking)}
                            title="View rental details"
                            className="size-9 rounded-lg text-muted-foreground hover:bg-yellow-400/10 hover:text-yellow-600"
                          >
                            <Eye size={17} />
                          </Button>

                          {booking.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Approve rental"
                                disabled={updatingId === booking._id}
                                onClick={() =>
                                  handleStatusUpdate(booking, "approved")
                                }
                                className="size-9 rounded-lg text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400"
                              >
                                {updatingId === booking._id ? (
                                  <Loader2 size={17} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={17} />
                                )}
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                title="Reject rental"
                                disabled={updatingId === booking._id}
                                onClick={() =>
                                  handleStatusUpdate(booking, "rejected")
                                }
                                className="size-9 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-500"
                              >
                                <XCircle size={17} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredBookings.length > 0 && (
            <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length} rental
              requests
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rental Details Dialog */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => {
          if (!open) closeDetails();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Rental Details
                </DialogTitle>

                <DialogDescription>
                  Review the customer, equipment and booking information.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Equipment Information */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-square sm:w-36 sm:shrink-0">
                    {selectedBooking.equipmentImage ? (
                      <img
                        src={selectedBooking.equipmentImage}
                        alt={selectedBooking.equipmentName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Package size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Equipment</p>

                      <h3 className="mt-1 text-lg font-bold text-foreground">
                        {selectedBooking.equipmentName}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`capitalize ${getBookingStatusStyle(selectedBooking.status)}`}
                      >
                        {selectedBooking.status}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`capitalize ${getPaymentStatusStyle(selectedBooking.paymentStatus)}`}
                      >
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Booking ID: {selectedBooking._id}
                    </p>
                  </div>
                </div>

                {/* Customer */}
                <div className="rounded-2xl border border-border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <UserRound
                      size={18}
                      className="text-yellow-600 dark:text-yellow-400"
                    />

                    <h3 className="font-semibold text-foreground">
                      Customer Information
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Customer Name
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-foreground">
                        {selectedBooking.renterName || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>

                      <p className="mt-1 break-words text-sm font-semibold text-foreground">
                        {selectedBooking.renterEmail || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contact Number
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-foreground">
                        {selectedBooking.contactNumber || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Delivery Address
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-foreground">
                        {selectedBooking.deliveryAddress || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rental Information */}
                <div className="rounded-2xl border border-border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarDays
                      size={18}
                      className="text-yellow-600 dark:text-yellow-400"
                    />

                    <h3 className="font-semibold text-foreground">
                      Rental Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Start Date", formatDate(selectedBooking.startDate)],
                      ["End Date", formatDate(selectedBooking.endDate)],
                      [
                        "Rental Duration",
                        `${selectedBooking.rentalDuration} ${selectedBooking.rentalType}`,
                      ],
                      ["Required Quantity", String(selectedBooking.quantity)],
                      [
                        "Price Per Unit",
                        formatPrice(selectedBooking.pricePerUnit),
                      ],
                      [
                        "Booking Amount",
                        formatPrice(selectedBooking.totalAmount),
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">{label}</p>

                        <p className="mt-1 break-words text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="rounded-2xl border border-border p-4">
                    <h3 className="mb-2 font-semibold text-foreground">
                      Customer Notes
                    </h3>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Booking Dates */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>
                    Requested: {formatDate(selectedBooking.createdAt)}
                  </span>

                  <span>Updated: {formatDate(selectedBooking.updatedAt)}</span>
                </div>

                {/* Pending Booking Actions */}
                {selectedBooking.status.toLowerCase() === "pending" && (
                  <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
                    <Button
                      variant="outline"
                      disabled={updatingId === selectedBooking._id}
                      onClick={() =>
                        handleStatusUpdate(selectedBooking, "rejected")
                      }
                      className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <XCircle size={17} />
                      Reject Request
                    </Button>

                    <Button
                      disabled={updatingId === selectedBooking._id}
                      onClick={() =>
                        handleStatusUpdate(selectedBooking, "approved")
                      }
                      className="flex-1 bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
                    >
                      {updatingId === selectedBooking._id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}
                      Approve Request
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={closeDetails}
                  className="w-full rounded-xl"
                >
                  Close Details
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
