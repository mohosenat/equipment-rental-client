import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f8f6] px-4 py-16 text-[#202020] dark:bg-[#111111] dark:text-white">
      <section className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#1b1b1b] sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
          !
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">
          Checkout Cancelled
        </p>

        <h1 className="mt-3 text-3xl font-bold">Payment Was Not Completed</h1>

        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
          You cancelled the Stripe checkout process. No successful payment has
          been confirmed. You can return to the equipment page and try again
          whenever you are ready.
        </p>

        <Link
          href="/equipment"
          className="mt-8 inline-flex rounded-xl bg-[#eab308] px-7 py-3 font-semibold text-black transition hover:bg-[#d6a107]"
        >
          Browse Equipment
        </Link>

        <div className="mt-5">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-black dark:hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
