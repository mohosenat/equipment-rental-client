"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  CalendarDays,
  UserRound,
  CheckCircle2,
  Loader2,
  Plus,
  Minus,
  X,
  CreditCard,
  Truck,
  AlertCircle,
  Mail,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  quantity: number;
  condition: "new" | "like-new" | "good" | "fair";
  brand?: string;
  model?: string;
  image: string;
  terms: string;
  status: "pending" | "approved" | "rejected";
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Favorite {
  _id: string;
  equipmentId: string;
  equipment?: {
    _id: string;
  };
}

const formatPrice = (price: number) =>
  `৳${Number(price || 0).toLocaleString("en-BD")}`;

const getRentalLabel = (type: string) => {
  const labels: Record<string, string> = {
    hourly: "Hour",
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
  };

  return labels[type] || type;
};

const getConditionLabel = (condition: string) => {
  const labels: Record<string, string> = {
    new: "Brand New",
    "like-new": "Like New",
    good: "Good",
    fair: "Fair",
  };

  return labels[condition] || condition;
};

// Get current date-time in the browser's local timezone.
// Important for datetime-local inputs.
const getLocalDateTimeValue = (date = new Date()) => {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
};

const getAuthHeaders = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please log in again.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };
};

export default function EquipmentDetailsClient({ id }: { id: string }) {
  const router = useRouter();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/equipment/${id}`, {
        headers,
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Unable to load equipment.");
      }

      const item: Equipment = result.data;

      if (!item) {
        throw new Error("Equipment information not found.");
      }

      setEquipment(item);

      // Load favorite status.
      try {
        const favoriteResponse = await fetch(`${API_URL}/favorites`, {
          headers,
          cache: "no-store",
        });

        const favoriteResult = await favoriteResponse.json().catch(() => ({}));

        if (favoriteResponse.ok) {
          const favorites: Favorite[] = favoriteResult.data || [];

          setIsFavorite(
            favorites.some(
              (favorite) =>
                String(favorite.equipmentId) === id ||
                String(favorite.equipment?._id) === id,
            ),
          );
        }
      } catch (error) {
        console.error("Favorite loading error:", error);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("authentication")
      ) {
        router.replace("/login");
        return;
      }

      setPageError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading equipment.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  // Add or remove favorite.
  const handleFavorite = async () => {
    if (!equipment || favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        isFavorite
          ? `${API_URL}/favorites/${equipment._id}`
          : `${API_URL}/favorites`,
        {
          method: isFavorite ? "DELETE" : "POST",
          headers,
          ...(isFavorite
            ? {}
            : {
                body: JSON.stringify({
                  equipmentId: equipment._id,
                }),
              }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to update favorites.");
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("authentication")
      ) {
        router.push("/login");
        return;
      }

      alert(
        error instanceof Error ? error.message : "Unable to update favorites.",
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const openBooking = () => {
    if (!equipment) return;

    setBookingError("");
    setBookingOpen(true);
  };

  // Create Stripe Checkout Session.
  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!equipment || bookingLoading) return;

    setBookingError("");

    // Validate selected dates.
    if (!startDate || !endDate) {
      setBookingError("Please select your rental dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setBookingError("Please select valid rental dates.");
      return;
    }

    if (start <= now) {
      setBookingError("Start date must be in the future.");
      return;
    }

    if (end <= start) {
      setBookingError("End date must be after start date.");
      return;
    }

    // Validate quantity.
    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1 ||
      Number(quantity) > equipment.quantity
    ) {
      setBookingError("Please select a valid equipment quantity.");
      return;
    }

    // Validate contact information.
    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      setBookingError("Contact number and delivery address are required.");
      return;
    }

    try {
      setBookingLoading(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            equipmentId: equipment._id,

            // Convert browser local time to UTC ISO format.
            startDate: start.toISOString(),
            endDate: end.toISOString(),

            quantity: Number(quantity),
            contactNumber: contactNumber.trim(),
            deliveryAddress: deliveryAddress.trim(),
            notes: notes.trim(),
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to create Stripe Checkout session.",
        );
      }

      const checkoutUrl = result.data?.checkoutUrl || result.checkoutUrl;

      // Validate Stripe Checkout URL.
      if (
        typeof checkoutUrl !== "string" ||
        !checkoutUrl.startsWith("https://checkout.stripe.com/")
      ) {
        throw new Error("Invalid Stripe Checkout URL received from server.");
      }

      // Redirect to Stripe Checkout.
      window.location.assign(checkoutUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      if (message.toLowerCase().includes("authentication")) {
        router.push("/login");
        return;
      }

      setBookingError(message);
      setBookingLoading(false);
    }
  };

  // Loading state.
  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-20">
        <div className="mx-auto max-w-6xl animate-pulse space-y-8">
          <div className="h-5 w-32 rounded bg-muted" />

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-3xl bg-muted" />

            <div className="space-y-5 py-4">
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-40 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state.
  if (pageError || !equipment) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <AlertCircle size={30} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-foreground">
          Equipment not found
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {pageError ||
            "This equipment may have been removed or is unavailable."}
        </p>

        <Link
          href="/equipment"
          className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
        >
          Browse Equipment
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-5 text-sm sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-muted-foreground transition hover:text-yellow-500"
          >
            Home
          </Link>

          <ChevronRight size={15} className="text-muted-foreground" />

          <Link
            href="/equipment"
            className="text-muted-foreground transition hover:text-yellow-500"
          >
            Equipment
          </Link>

          <ChevronRight size={15} className="text-muted-foreground" />

          <span className="max-w-[180px] truncate font-medium text-foreground">
            {equipment.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/equipment"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-yellow-500"
        >
          <ArrowLeft size={17} />
          Back to equipment
        </Link>

        {/* Main Showcase */}
        <div className="grid items-start gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Image */}
          <div className="space-y-4">
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-muted">
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-xs font-bold text-foreground shadow-sm backdrop-blur">
                <CheckCircle2 size={15} className="text-green-500" />
                Verified listing
              </div>

              <button
                type="button"
                onClick={handleFavorite}
                disabled={favoriteLoading}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:text-red-500 disabled:opacity-50"
              >
                {favoriteLoading ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <Heart
                    size={21}
                    className={isFavorite ? "fill-red-500 text-red-500" : ""}
                  />
                )}
              </button>

              {equipment.image ? (
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-muted-foreground">
                  <Package size={64} />
                </div>
              )}
            </div>

            {/* Short highlights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <Package size={19} className="text-yellow-500" />
                <p className="mt-3 text-lg font-bold text-foreground">
                  {equipment.quantity}
                </p>
                <p className="text-xs text-muted-foreground">Total stock</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <ShieldCheck size={19} className="text-yellow-500" />
                <p className="mt-3 text-sm font-bold text-foreground">
                  {getConditionLabel(equipment.condition)}
                </p>
                <p className="text-xs text-muted-foreground">Condition</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <Truck size={19} className="text-yellow-500" />
                <p className="mt-3 text-sm font-bold text-foreground">Rental</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>

          {/* Equipment Information */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-yellow-400/15 px-3 py-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                {equipment.category}
              </span>

              <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {getConditionLabel(equipment.condition)}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[42px] lg:leading-tight">
              {equipment.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={17} className="shrink-0 text-yellow-500" />
              {equipment.location}
            </div>

            {/* Price */}
            <div className="mt-7 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <p className="text-sm text-muted-foreground">Rental price</p>

              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {formatPrice(equipment.price)}
                </span>

                <span className="text-sm font-medium text-muted-foreground">
                  / {getRentalLabel(equipment.rentalType)}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Final rental amount will be calculated based on your selected
                dates and quantity.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openBooking}
                  disabled={equipment.quantity < 1}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarDays size={19} />
                  Book Now
                </button>

                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-semibold transition ${
                    isFavorite
                      ? "border-red-500/30 bg-red-500/10 text-red-500"
                      : "border-border bg-background text-foreground hover:border-yellow-400"
                  }`}
                >
                  <Heart
                    size={18}
                    className={isFavorite ? "fill-current" : ""}
                  />
                  {isFavorite ? "Saved" : "Favorite"}
                </button>
              </div>
            </div>

            {/* Owner */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                  <UserRound size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Listed by
                  </p>

                  <p className="mt-1 truncate font-semibold text-foreground">
                    Equipment Owner
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Mail size={13} />
                    {equipment.ownerEmail}
                  </p>
                </div>

                <ShieldCheck size={22} className="shrink-0 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Description */}
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                  <Package size={20} />
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  Equipment Overview
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                {equipment.description || "No description provided."}
              </p>

              {(equipment.brand || equipment.model) && (
                <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                  {equipment.brand && (
                    <div>
                      <p className="text-xs text-muted-foreground">Brand</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {equipment.brand}
                      </p>
                    </div>
                  )}

                  {equipment.model && (
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {equipment.model}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Rental terms */}
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                  <ShieldCheck size={20} />
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  Rental Terms & Conditions
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                {equipment.terms || "No additional rental terms provided."}
              </p>
            </section>
          </div>

          {/* Quick Summary */}
          <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold text-foreground">
              Rental Summary
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">
                  {equipment.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Rental type</span>
                <span className="font-semibold capitalize text-foreground">
                  {equipment.rentalType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-semibold text-foreground">
                  {equipment.quantity} units
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Condition</span>
                <span className="font-semibold text-foreground">
                  {getConditionLabel(equipment.condition)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="max-w-[150px] truncate text-right font-semibold text-foreground">
                  {equipment.location}
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck size={17} className="shrink-0 text-green-500" />
              Secure payment through Stripe Checkout.
            </div>

            <button
              type="button"
              onClick={openBooking}
              disabled={equipment.quantity < 1}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rent This Equipment
              <ChevronRight size={18} />
            </button>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !bookingLoading) {
              setBookingOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="booking-title"
                  className="text-xl font-bold text-foreground"
                >
                  Book Equipment
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Complete your rental details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                disabled={bookingLoading}
                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                aria-label="Close booking modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 p-5 sm:p-6">
              {/* Equipment preview */}
              <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                {equipment.image ? (
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="size-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-background text-muted-foreground">
                    <Package size={25} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {equipment.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPrice(equipment.price)} /{" "}
                    {getRentalLabel(equipment.rentalType)}
                  </p>
                </div>
              </div>

              {/* Rental Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-xs font-semibold text-foreground"
                  >
                    Start Date & Time
                  </label>

                  <input
                    id="startDate"
                    type="datetime-local"
                    required
                    min={getLocalDateTimeValue()}
                    value={startDate}
                    onChange={(event) => {
                      setStartDate(event.target.value);

                      if (
                        endDate &&
                        new Date(endDate) <= new Date(event.target.value)
                      ) {
                        setEndDate("");
                      }
                    }}
                    className="w-full min-w-0 rounded-xl border border-border bg-background px-3 py-3 text-xs text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-xs font-semibold text-foreground"
                  >
                    End Date & Time
                  </label>

                  <input
                    id="endDate"
                    type="datetime-local"
                    required
                    min={startDate || getLocalDateTimeValue()}
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="w-full min-w-0 rounded-xl border border-border bg-background px-3 py-3 text-xs text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Required Quantity
                  </label>

                  <span className="text-xs text-muted-foreground">
                    {equipment.quantity} available in stock
                  </span>
                </div>

                <div className="flex h-12 items-center justify-between rounded-xl border border-border px-3">
                  <span className="text-sm text-muted-foreground">
                    Equipment units
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      disabled={quantity <= 1}
                      className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-yellow-400 hover:text-black disabled:opacity-40"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="min-w-5 text-center text-sm font-bold text-foreground">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) =>
                          Math.min(equipment.quantity, value + 1),
                        )
                      }
                      disabled={quantity >= equipment.quantity}
                      className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-yellow-400 hover:text-black disabled:opacity-40"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="mb-2 block text-xs font-semibold text-foreground"
                >
                  Contact Number
                </label>

                <input
                  id="contactNumber"
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="mb-2 block text-xs font-semibold text-foreground"
                >
                  Delivery Address
                </label>

                <input
                  id="deliveryAddress"
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Optional notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-xs font-semibold text-foreground"
                >
                  Additional Notes{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Any special instructions..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Price info */}
              <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard
                    size={17}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  Secure Stripe Checkout
                </div>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your rental duration and total amount will be calculated by
                  the server. You will be redirected to Stripe to complete your
                  payment securely.
                </p>
              </div>

              {bookingError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs leading-5 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {bookingError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={bookingLoading || equipment.quantity < 1}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparing Checkout...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-muted-foreground">
                Your booking will be confirmed after successful payment and
                server verification.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
