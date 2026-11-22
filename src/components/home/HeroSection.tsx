"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      router.push(`/equipment?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/equipment");
    }
  };

  return (
    <section
      className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-[#17191B] bg-cover bg-center bg-no-repeat px-5 py-20"
      style={{
        backgroundImage: "url('/images/hero-equipment.jpg')",
      }}
    >
      {/* Theme-aware image overlays */}
      <div className="absolute inset-0 bg-black/45 dark:bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#F5C542] sm:text-sm">
            Equipment Rental Made Simple
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            The Right Equipment.
            <span className="mt-2 block text-[#F5C542]">
              Right When You Need It.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
            Find and rent quality equipment for every project. Explore reliable
            rental options and get the right tools for the job.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-gray-500" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What equipment are you looking for?"
                className="h-12 w-full bg-transparent text-sm text-[#202124] outline-none placeholder:text-gray-400 sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#202124] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#383A3D] sm:rounded-full"
            >
              Search Equipment
              <ArrowRight size={17} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/equipment")}
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-[#F5C542]"
          >
            Explore all equipment
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.25em]">
          Scroll to explore
        </span>
        <div className="h-9 w-px bg-white/50" />
      </div>
    </section>
  );
}
