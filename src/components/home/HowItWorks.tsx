"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, PackageCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Equipment",
    description: "Browse categories or search for the equipment you need.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book Your Rental",
    description:
      "Choose your preferred rental period and submit a booking request.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Get to Work",
    description:
      "Coordinate with the equipment owner and get started on your project.",
  },
];

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section className="bg-background px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
            Simple process
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            How RENTRO Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get the equipment you need in three simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                    <Icon size={27} />
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/equipment")}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Start Exploring
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
