"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X,
  RotateCcw,
  Clock3,
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
  brand?: string;
  model?: string;
};

type EquipmentResponse = {
  success: boolean;
  message: string;
  data: Equipment[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Construction Equipment", value: "construction" },
  { label: "Photography Equipment", value: "photography" },
  { label: "Vehicles & Transportation", value: "vehicles" },
  { label: "Agriculture Equipment", value: "agriculture" },
  { label: "Electronics", value: "electronics" },
  { label: "Event Equipment", value: "event equipment" },
];

const rentalTypes = [
  { label: "All Rental Types", value: "" },
  { label: "Hourly", value: "hourly" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const sortOptions = [
  { label: "Newest First", value: "recent" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

const ITEMS_PER_PAGE = 9;

export default function EquipmentPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Filters
  const [category, setCategory] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("recent");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Retry
  const [retryCount, setRetryCount] = useState(0);

  // Favorites (temporary frontend state)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Read search query from homepage URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || "";

    if (initialSearch) {
      setSearchInput(initialSearch);
      setSearch(initialSearch);
    }
  }, []);

  // Fetch equipment whenever filters change
  useEffect(() => {
    const controller = new AbortController();

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (rentalType) params.set("rentalType", rentalType);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        params.set("sort", sort);

        const response = await fetch(
          `${API_URL}/equipment?${params.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load equipment.");
        }

        const result: EquipmentResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid equipment response.");
        }

        setEquipment(result.data);
        setCurrentPage(1);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => controller.abort();
  }, [search, category, rentalType, minPrice, maxPrice, sort, retryCount]);

  // Apply search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  // Clear all filters
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setRentalType("");
    setMinPrice("");
    setMaxPrice("");
    setSort("recent");
    setCurrentPage(1);
  };

  // Toggle favorite icon
  const handleFavorite = (id: string) => {
    setFavoriteIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  // Equipment details
  const handleViewDetails = (id: string) => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    router.push(`/equipment/${id}`);
  };

  // Price formatting
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD").format(price || 0);

  // Pagination calculations
  const totalPages = Math.ceil(equipment.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentEquipment = equipment.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const hasActiveFilters =
    search || category || rentalType || minPrice || maxPrice;

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-[#202124] transition-colors dark:bg-[#111315] dark:text-white sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A17D25] dark:text-[#DDBA50]">
            Explore RENTRO
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Explore All Equipment
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Find the right equipment for your project. Explore quality rental
            options at flexible prices.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 dark:border-white/10 dark:bg-[#1B1D1F] sm:p-6">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex h-12 flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 dark:border-white/10 dark:bg-[#111315]">
              <Search size={19} className="shrink-0 text-gray-400" />

              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search equipment by name or location..."
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#202124] px-8 text-sm font-semibold text-white transition hover:bg-[#383A3D] dark:bg-white dark:text-[#202124] dark:hover:bg-gray-200"
            >
              <Search size={17} />
              Search
            </button>
          </form>

          {/* Filter heading */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <h2 className="text-sm font-semibold">Filter Equipment</h2>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-[#A17D25] dark:text-gray-400 dark:hover:text-[#F5C542]"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          </div>

          {/* Filter controls */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#A17D25] dark:border-white/10 dark:bg-[#111315]"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Type */}
            <div>
              <label
                htmlFor="rentalType"
                className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Rental Type
              </label>

              <select
                id="rentalType"
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#A17D25] dark:border-white/10 dark:bg-[#111315]"
              >
                {rentalTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Price */}
            <div>
              <label
                htmlFor="minPrice"
                className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Minimum Price (৳)
              </label>

              <input
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Minimum price"
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#A17D25] dark:border-white/10 dark:bg-[#111315]"
              />
            </div>

            {/* Maximum Price */}
            <div>
              <label
                htmlFor="maxPrice"
                className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Maximum Price (৳)
              </label>

              <input
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maximum price"
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#A17D25] dark:border-white/10 dark:bg-[#111315]"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">Available Equipment</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? "Loading equipment..."
                : `${equipment.length} equipment found`}
            </p>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="shrink-0 text-sm text-gray-500 dark:text-gray-400"
            >
              Sort by:
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-[#1B1D1F]"
            >
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Information */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>

            {search && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-[#25282B]">
                Search: {search}
              </span>
            )}

            {category && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-[#25282B]">
                {categories.find((item) => item.value === category)?.label}
              </span>
            )}

            {rentalType && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize dark:bg-[#25282B]">
                {rentalType}
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-[#25282B]">
                ৳{minPrice || "0"} - ৳{maxPrice || "Any"}
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-red-500"
            >
              <X size={13} />
              Clear
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10"
              >
                <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-[#25282B]" />

                <div className="space-y-4 p-5">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-[#25282B]" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-[#25282B]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-[#25282B]" />
                  <div className="h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-[#25282B]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-14 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((previous) => previous + 1)}
              className="mt-5 rounded-lg bg-[#202124] px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-[#202124]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && equipment.length === 0 && (
          <div className="rounded-2xl border border-gray-200 px-5 py-16 text-center dark:border-white/10">
            <PackageOpen size={42} className="mx-auto mb-4 text-gray-400" />

            <h3 className="text-xl font-semibold">No Equipment Found</h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters to find equipment.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-lg bg-[#202124] px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-[#202124]"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Equipment Grid */}
        {!loading && !error && currentEquipment.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentEquipment.map((item, index) => {
                const isFavorite = favoriteIds.includes(item._id);

                return (
                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageOpen
                            size={42}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}

                      {/* Category */}
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-gray-800">
                        {item.category}
                      </span>

                      {/* Favorite */}
                      <button
                        type="button"
                        aria-label={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        aria-pressed={isFavorite}
                        onClick={() => handleFavorite(item._id)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                      >
                        <Heart
                          size={19}
                          className={
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-gray-800"
                          }
                        />
                      </button>
                    </div>

                    {/* Information */}
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

                      {/* Location and Rental Type */}
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

                      {/* Price and Button */}
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <p className="text-lg font-bold text-foreground">
                          ৳{formatPrice(item.price)}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            / {item.rentalType}
                          </span>
                        </p>

                        <button
                          type="button"
                          onClick={() => handleViewDetails(item._id)}
                          disabled={isPending}
                          className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((previous) => previous - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-[#25282B]"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-[#202124] text-white dark:bg-white dark:text-[#202124]"
                        : "border border-gray-200 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-[#25282B]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((previous) => previous + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-[#25282B]"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Results information */}
            {equipment.length > 0 && (
              <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, equipment.length)} of{" "}
                {equipment.length} equipment
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
