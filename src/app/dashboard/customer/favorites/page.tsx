"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  MapPin,
  Package,
  ArrowUpRight,
  Trash2,
  BookmarkCheck,
  Boxes,
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

type FavoriteEquipment = {
  id: string;
  name: string;
  category: string;
  image: string;
  location: string;
  price: number;
  rentalType: string;
  condition: string;
};

const initialFavorites: FavoriteEquipment[] = [
  {
    id: "equipment-001",
    name: "Professional DSLR Camera",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    location: "Dhaka, Bangladesh",
    price: 1500,
    rentalType: "Daily",
    condition: "Excellent",
  },
  {
    id: "equipment-002",
    name: "Industrial Generator",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
    location: "Chattogram, Bangladesh",
    price: 2500,
    rentalType: "Daily",
    condition: "Good",
  },
  {
    id: "equipment-003",
    name: "Excavator Machine",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1580901368919-7739efb0f5e0?w=400&q=80",
    location: "Gazipur, Bangladesh",
    price: 8500,
    rentalType: "Daily",
    condition: "Excellent",
  },
  {
    id: "equipment-004",
    name: "Event Sound System",
    category: "Event Equipment",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    location: "Dhaka, Bangladesh",
    price: 3500,
    rentalType: "Daily",
    condition: "Good",
  },
];

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const categories = new Set(favorites.map((item) => item.category)).size;

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mx-auto w-full space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
              <Heart size={16} />
            </span>
            Customer Workspace
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Favorites
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Keep your favorite rental equipment saved and easily find them
            whenever you need.
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Saved Equipment",
            value: favorites.length.toString().padStart(2, "0"),
            description: "Items in your wishlist",
            icon: BookmarkCheck,
            iconStyle: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400",
          },
          {
            title: "Categories Saved",
            value: categories.toString().padStart(2, "0"),
            description: "Different equipment types",
            icon: Boxes,
            iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          },
          {
            title: "Wishlist",
            value: "Active",
            description: "Your personal collection",
            icon: Heart,
            iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          },
        ].map((item) => {
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

      {/* Favorites Collection */}
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-lg font-bold">Saved Equipment</CardTitle>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Your shortlisted equipment for future rentals.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
          >
            {favorites.length} Saved Items
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {favorites.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[260px] px-5 py-4 sm:px-6">
                      Equipment
                    </TableHead>

                    <TableHead className="min-w-[140px]">Category</TableHead>

                    <TableHead className="min-w-[180px]">Location</TableHead>

                    <TableHead className="min-w-[140px]">
                      Rental Price
                    </TableHead>

                    <TableHead className="min-w-[120px]">Condition</TableHead>

                    <TableHead className="min-w-[130px] px-5 text-right sm:px-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {favorites.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-border/60 transition-colors hover:bg-muted/30"
                    >
                      {/* Equipment */}
                      <TableCell className="px-5 py-4 sm:px-6">
                        <div className="flex min-w-[230px] items-center gap-3">
                          <div className="h-[60px] w-[70px] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug">
                              {item.name}
                            </p>

                            <p className="mt-1.5 text-xs text-muted-foreground">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-lg px-2.5 py-1 text-xs font-medium"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin
                            size={15}
                            className="shrink-0 text-yellow-500"
                          />
                          <span className="whitespace-nowrap">
                            {item.location}
                          </span>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <div>
                          <p className="text-sm font-bold">
                            ৳{item.price.toLocaleString("en-BD")}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            / {item.rentalType.toLowerCase()}
                          </p>
                        </div>
                      </TableCell>

                      {/* Condition */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          {item.condition}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 text-right sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${item.id}`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-yellow-400 px-3 text-xs font-semibold text-black transition hover:bg-yellow-500"
                          >
                            View
                            <ArrowUpRight size={14} />
                          </Link>

                          <button
                            onClick={() => removeFavorite(item.id)}
                            title="Remove from favorites"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                <Heart size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold">No Favorites Yet</h3>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                You haven&apos;t saved any equipment yet. Explore our collection
                and add your favorite items here.
              </p>

              <Link
                href="/equipment"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-500"
              >
                Explore Equipment
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Looking for something else?</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Discover more equipment and find the perfect match for your project.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
        >
          Explore Collection
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Demo Notice */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Showing sample favorite equipment for frontend development. Your saved
        items will appear here after API integration.
      </p>
    </div>
  );
}
