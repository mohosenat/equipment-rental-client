"use client";

import { motion } from "framer-motion";
import {
  Construction,
  Camera,
  Truck,
  Sprout,
  Laptop,
  PartyPopper,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Construction",
    value: "construction",
    description: "Tools and heavy machinery for every project.",
    icon: Construction,
  },
  {
    name: "Photography",
    value: "photography",
    description: "Cameras, lenses and creative equipment.",
    icon: Camera,
  },
  {
    name: "Vehicles",
    value: "vehicles",
    description: "Transportation and vehicles for your needs.",
    icon: Truck,
  },
  {
    name: "Agriculture",
    value: "agriculture",
    description: "Equipment to make farm work easier.",
    icon: Sprout,
  },
  {
    name: "Electronics",
    value: "electronics",
    description: "Essential electronic tools and devices.",
    icon: Laptop,
  },
  {
    name: "Event Equipment",
    value: "event equipment",
    description: "Everything you need for special events.",
    icon: PartyPopper,
  },
];

export default function CategorySection() {
  const router = useRouter();

  return (
    <section className="bg-muted/40 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
            Explore by category
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Find Equipment for Every Need
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Discover equipment across different categories and find the right
            tools for your work.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.value}
                type="button"
                onClick={() =>
                  router.push(
                    `/equipment?category=${encodeURIComponent(category.value)}`,
                  )
                }
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className="group flex w-full items-start gap-5 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 transition group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-foreground">
                      {category.name}
                    </h3>
                    <ArrowUpRight
                      size={19}
                      className="text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-yellow-600"
                    />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
