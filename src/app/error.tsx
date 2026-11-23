"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RENTRO Application Error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-600">
          <AlertTriangle size={38} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
          Something went wrong
        </p>

        <h1 className="mb-4 font-[var(--font-manrope)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops! An unexpected error occurred.
        </h1>

        <p className="mb-8 text-sm leading-7 text-muted-foreground sm:text-base">
          We couldn't complete your request. Please try again. If the problem
          continues, return to the homepage.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground">
            Error Reference: {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
