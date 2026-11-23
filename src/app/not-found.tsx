import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-yellow-500/10">
          <SearchX size={54} className="text-yellow-600" />

          <span className="absolute -right-3 -top-2 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
            404
          </span>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
          Page Not Found
        </p>

        <h1 className="mb-4 font-[var(--font-manrope)] text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Lost your way?
        </h1>

        <p className="mx-auto mb-9 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to discovering equipment.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          <Home size={18} />
          Back to Homepage
        </Link>

        <div className="mt-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-yellow-600"
          >
            <ArrowLeft size={15} />
            Explore Equipment
          </Link>
        </div>

        <p className="mt-12 text-xs font-medium tracking-widest text-muted-foreground">
          RENTRO — EQUIPMENT RENTAL MARKETPLACE
        </p>
      </div>
    </section>
  );
}
