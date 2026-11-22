"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Package, Clock3, AlertCircle } from "lucide-react";
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
  brand?: string;
  model?: string;
  image: string;
};

type EquipmentResponse = {
  success: boolean;
  message: string;
  data: Equipment[];
};

export default function FeaturedEquipment() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Equipment API URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/equipment?limit=6`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load equipment right now.");
        }

        const result: EquipmentResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid equipment response from server.");
        }

        setEquipment(result.data.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleViewDetails = (id: string) => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    router.push(`/equipment/${id}`);
  };

  return (
    <section className="bg-background px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Handpicked for you
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Equipment
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore quality equipment selected for your next project.
            </p>
          </div>

          <button
            onClick={() => router.push("/equipment")}
            className="inline-flex w-fit items-center gap-2 font-semibold text-foreground transition hover:text-yellow-600"
          >
            Explore All Equipment
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border"
              >
                <div className="h-56 animate-pulse bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <AlertCircle className="mx-auto text-yellow-600" size={30} />
            <p className="mt-3 font-medium text-foreground">
              Could not load featured equipment
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-yellow-400 px-5 py-2.5 font-semibold text-black hover:bg-yellow-300"
            >
              Try Again
            </button>
          </div>
        ) : equipment.length === 0 ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <Package className="mx-auto text-muted-foreground" size={32} />
            <p className="mt-3 font-medium text-foreground">
              No approved equipment available yet.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-gray-800">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-sm font-semibold capitalize text-yellow-600">
                      {item.condition}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{item.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <Clock3 size={14} />
                      {item.rentalType}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-lg font-bold text-foreground">
                      ৳{item.price.toLocaleString("en-BD")}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / {item.rentalType}
                      </span>
                    </p>

                    <button
                      onClick={() => handleViewDetails(item._id)}
                      disabled={isPending}
                      className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/equipment")}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            Browse All Equipment
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
