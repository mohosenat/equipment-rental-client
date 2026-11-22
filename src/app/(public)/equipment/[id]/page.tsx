"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock3,
  Package,
  Heart,
  CalendarDays,
  ShieldCheck,
  UserRound,
  CheckCircle2,
  Truck,
  Share2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Equipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  quantity: number;
  condition: string;
  image: string;
  terms: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerImage?: string;
  brand?: string;
  model?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!id || isPending || !session) return;

    const controller = new AbortController();

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/equipment/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load equipment details.");
        }

        const result = await response.json();
        const equipmentData = result.data || result.equipment || result;

        setEquipment(equipmentData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading equipment.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => controller.abort();
  }, [id, isPending, session]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD").format(price);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading equipment details...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (error || !equipment) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Package className="mx-auto h-14 w-14 text-muted-foreground" />

          <h2 className="mt-5 text-2xl font-bold text-foreground">
            Equipment not found
          </h2>

          <p className="mt-3 text-muted-foreground">
            {error || "This equipment may no longer be available."}
          </p>

          <button
            onClick={() => router.push("/equipment")}
            className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Browse Equipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/equipment")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={18} />
            Back to Equipment
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span>Equipment</span>
            <span>/</span>
            <span className="capitalize text-foreground">
              {equipment.category}
            </span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">
            Explore Equipment
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Equipment Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Everything you need to know before making your rental.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Equipment Image */}
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-muted">
              <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold capitalize text-black shadow-lg">
                  {equipment.category}
                </span>

                <span className="rounded-full border border-white/30 bg-black/65 px-4 py-2 text-xs font-semibold capitalize text-white backdrop-blur-md">
                  {equipment.condition}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent p-6 pt-20">
                <p className="text-sm font-medium text-white/75">
                  Available for rental
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {equipment.quantity} units available
                </p>
              </div>
            </div>

            {/* Equipment Information */}
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-400">
                    Equipment Overview
                  </p>

                  <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {equipment.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={17} className="shrink-0 text-yellow-600" />
                    {equipment.location}
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  title="Favorites functionality will be added next"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition"
                >
                  <Heart size={20} />
                </button>
              </div>

              <div className="my-7 h-px bg-border" />

              <h3 className="text-lg font-bold text-foreground">
                About This Equipment
              </h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {equipment.description}
              </p>

              {/* Quick Information */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <Clock3
                    size={20}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Rental Type
                  </p>
                  <p className="mt-1 font-bold capitalize text-foreground">
                    {equipment.rentalType}
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-4">
                  <Package
                    size={20}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Availability
                  </p>
                  <p className="mt-1 font-bold text-foreground">
                    {equipment.quantity} units
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl bg-muted/60 p-4 sm:col-span-1">
                  <CheckCircle2
                    size={20}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Condition
                  </p>
                  <p className="mt-1 font-bold capitalize text-foreground">
                    {equipment.condition}
                  </p>
                </div>
              </div>
            </section>

            {/* Owner Information */}
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-400">
                    Your Rental Partner
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">
                    Equipment Owner
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                  <UserRound size={21} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
                {equipment.ownerImage ? (
                  <img
                    src={equipment.ownerImage}
                    alt={equipment.ownerName || "Equipment Owner"}
                    className="h-14 w-14 rounded-full border-2 border-border object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background">
                    <UserRound size={25} className="text-muted-foreground" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-bold text-foreground">
                    {equipment.ownerName || "Equipment Owner"}
                  </p>

                  {equipment.ownerEmail && (
                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {equipment.ownerEmail}
                    </p>
                  )}

                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 size={14} />
                    Listed on RENTRO
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Booking Card */}
            <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="bg-[#171717] p-6 text-white sm:p-8">
                <p className="text-sm font-medium text-white/60">
                  Rental Price
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    ৳{formatPrice(equipment.price)}
                  </span>

                  <span className="text-sm font-medium capitalize text-white/60">
                    / {equipment.rentalType}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
                  <MapPin size={16} className="text-yellow-400" />
                  {equipment.location}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground">
                  Rental Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      Rental Rate
                    </span>
                    <span className="font-semibold capitalize text-foreground">
                      ৳{formatPrice(equipment.price)} / {equipment.rentalType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      Available Quantity
                    </span>
                    <span className="font-semibold text-foreground">
                      {equipment.quantity} units
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      Equipment Condition
                    </span>
                    <span className="font-semibold capitalize text-foreground">
                      {equipment.condition}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-border" />

                <button
                  type="button"
                  disabled
                  title="Booking functionality will be added next"
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-black opacity-70"
                >
                  <CalendarDays size={19} />
                  Book Now
                </button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Booking will be available in the next step.
                </p>

                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Secure rental process with Stripe payment integration.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck
                      size={19}
                      className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Review delivery arrangements and rental terms before
                      booking.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Small Note */}
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-yellow-700 dark:text-yellow-400"
                />

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Rent with Confidence
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Check the equipment details, availability and rental
                    conditions before confirming your booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Terms */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-600 dark:text-yellow-400">
                Before You Rent
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                Rental Terms & Conditions
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-muted/50 p-5 sm:p-6">
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {equipment.terms || "No rental terms have been provided."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
