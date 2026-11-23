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
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication required. Please log in again.");
    }

    return {
      Authorization: `Bearer ${data.token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("JWT TOKEN FETCH FAILED:", error);
    throw error;
  }
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
      console.error("LOAD EQUIPMENT ERROR:", error);

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
    <main className="min-h-screen bg-background pb-24">
      {/* Breadcrumb */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6">
          <Link href="/" className="transition hover:text-yellow-500">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/equipment" className="transition hover:text-yellow-500">
            Equipment
          </Link>
          <ChevronRight size={13} />
          <span className="truncate text-foreground">{equipment.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Top header */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span>Back to equipment</span>
          </Link>

          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteLoading}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className={`flex size-10 items-center justify-center rounded-full border transition ${
              isFavorite
                ? "border-red-500/20 bg-red-500/10 text-red-500"
                : "border-border bg-card text-muted-foreground hover:border-yellow-400 hover:text-yellow-500"
            }`}
          >
            {favoriteLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            )}
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-yellow-400/15 px-2.5 py-1 text-xs font-semibold capitalize text-yellow-700 dark:text-yellow-400">
              {equipment.category}
            </span>

            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 size={13} />
              Available for rental
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {equipment.name}
          </h1>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={15} className="text-yellow-500" />
            {equipment.location}
          </p>
        </div>

        {/* Main showcase */}
        <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_0.85fr]">
          {/* Image */}
          <div className="group relative overflow-hidden rounded-2xl bg-muted">
            {equipment.image ? (
              <img
                src={equipment.image}
                alt={equipment.name}
                className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-muted-foreground">
                <Package size={60} />
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                {equipment.quantity} units available
              </span>

              <span className="rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-gray-900 backdrop-blur">
                {getConditionLabel(equipment.condition)}
              </span>
            </div>
          </div>

          {/* Rental panel */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Rental price
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {formatPrice(equipment.price)}
              </span>

              <span className="text-sm text-muted-foreground">
                / {getRentalLabel(equipment.rentalType).toLowerCase()}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Price depends on rental duration and quantity.
            </p>

            <button
              type="button"
              onClick={openBooking}
              disabled={equipment.quantity < 1}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarDays size={17} />
              Book this equipment
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-green-500" />
              Secure Stripe checkout
            </div>

            <div className="my-5 border-t border-border" />

            {/* Quick info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package size={16} />
                  Available quantity
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {equipment.quantity} units
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  Rental period
                </span>
                <span className="text-sm font-semibold capitalize text-foreground">
                  {equipment.rentalType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck size={16} />
                  Condition
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {getConditionLabel(equipment.condition)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-muted/50 p-3.5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-green-500"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Protected checkout
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Payment is processed securely through Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-6">
            {/* Description */}
            <section className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground">
                About this equipment
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {equipment.description || "No description provided."}
              </p>
            </section>

            {/* Specifications */}
            <section className="border-b border-border pb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Specifications
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {[
                  { label: "Category", value: equipment.category },
                  { label: "Brand", value: equipment.brand || "Not specified" },
                  { label: "Model", value: equipment.model || "Not specified" },
                  {
                    label: "Condition",
                    value: getConditionLabel(equipment.condition),
                  },
                  {
                    label: "Rental type",
                    value: equipment.rentalType,
                  },
                  {
                    label: "Quantity",
                    value: `${equipment.quantity} units`,
                  },
                  {
                    label: "Rental price",
                    value: `${formatPrice(equipment.price)} / ${getRentalLabel(equipment.rentalType)}`,
                  },
                  {
                    label: "Location",
                    value: equipment.location,
                  },
                ].map((item) => (
                  <div key={item.label} className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium capitalize text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Rental terms */}
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                Rental terms & conditions
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {equipment.terms || "No additional rental terms provided."}
              </p>
            </section>
          </div>

          {/* Owner */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Listed by
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-700 dark:text-yellow-400">
                <UserRound size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Equipment Owner
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {equipment.ownerEmail}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <ShieldCheck size={15} className="text-green-500" />
              Equipment listing
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 px-3 py-5 backdrop-blur-md sm:px-5"
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
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <h2
                      id="booking-title"
                      className="text-lg font-bold text-foreground"
                    >
                      Reserve equipment
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Enter your rental details
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                disabled={bookingLoading}
                aria-label="Close booking modal"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-5 p-5 sm:p-6">
              {/* Item summary */}
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                {equipment.image ? (
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="size-[68px] shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-[68px] shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <Package size={24} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {equipment.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPrice(equipment.price)} /{" "}
                    {getRentalLabel(equipment.rentalType).toLowerCase()}
                  </p>

                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    {equipment.quantity} units available
                  </p>
                </div>
              </div>

              {/* Date selection */}
              <div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    Rental period
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select when you need the equipment
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Start date & time
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
                      className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      End date & time
                    </label>

                    <input
                      id="endDate"
                      type="datetime-local"
                      required
                      min={startDate || getLocalDateTimeValue()}
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-foreground">
                  Required quantity
                </label>

                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Equipment units
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Maximum {equipment.quantity} units
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex size-8 items-center justify-center rounded-lg border border-border transition hover:bg-muted disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-5 text-center text-sm font-bold text-foreground">
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
                      aria-label="Increase quantity"
                      className="flex size-8 items-center justify-center rounded-lg border border-border transition hover:bg-muted disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="mb-1.5 block text-xs font-semibold text-foreground"
                  >
                    Contact number
                  </label>

                  <input
                    id="contactNumber"
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value)}
                    placeholder="Your phone number"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deliveryAddress"
                    className="mb-1.5 block text-xs font-semibold text-foreground"
                  >
                    Delivery address
                  </label>

                  <input
                    id="deliveryAddress"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    placeholder="Your delivery address"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-1.5 block text-xs font-semibold text-foreground"
                >
                  Additional notes{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add special instructions..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>

              {/* Payment info */}
              <div className="flex items-start gap-3 rounded-xl border border-yellow-400/25 bg-yellow-400/5 p-3.5">
                <CreditCard
                  size={18}
                  className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                />

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Secure payment with Stripe
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Total rental cost will be calculated and availability
                    validated before redirecting to checkout.
                  </p>
                </div>
              </div>

              {/* Error */}
              {bookingError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{bookingError}</p>
                </div>
              )}

              {/* Submit */}
              <div className="border-t border-border pt-4">
                <button
                  type="submit"
                  disabled={bookingLoading || equipment.quantity < 1}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Preparing checkout...
                    </>
                  ) : (
                    <>
                      Continue to payment
                      <ChevronRight size={17} />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
                  Booking confirmation depends on successful payment and server
                  verification.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
