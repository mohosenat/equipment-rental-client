"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CircleCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const highlights = [
  "Equipment listings go through an approval process.",
  "Owners can manage their equipment and rental requests.",
  "Customers can explore equipment across multiple categories.",
];

export default function TrustedOwners() {
  const router = useRouter();

  return (
    <section className="overflow-hidden bg-[#171A1C] px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            A better rental community
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Bring Your Equipment to
            <span className="text-yellow-400"> RENTRO</span>
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-white/65">
            Have equipment that others could use? Join RENTRO as an equipment
            owner, create listings, and manage your rental activity from one
            place.
          </p>

          <div className="mt-8 space-y-4">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3">
                <CircleCheck
                  className="mt-1 shrink-0 text-yellow-400"
                  size={19}
                />
                <p className="text-sm leading-6 text-white/80">{highlight}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/register")}
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Become an Equipment Owner
            <ArrowRight size={18} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black">
              <Users size={32} />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <BadgeCheck className="text-yellow-400" size={23} />
              <span className="text-sm font-semibold text-yellow-400">
                Owner-friendly platform
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold">
              Your equipment can do more.
            </h3>

            <p className="mt-4 leading-7 text-white/60">
              List your available equipment, keep your listings organized, and
              manage rental requests through your owner dashboard.
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm text-white/50">Ready to get started?</p>
              <button
                onClick={() => router.push("/register")}
                className="mt-3 inline-flex items-center gap-2 font-semibold text-white transition hover:text-yellow-400"
              >
                Create your account
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
