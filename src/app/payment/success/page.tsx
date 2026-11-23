"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentResult {
  paymentStatus: string;
  processingStatus: string;
  message?: string;
  booking?: {
    id: string;
    status: string;
    equipmentName: string;
    totalAmount: number;
  } | null;
  payment?: {
    amount: number;
    currency: string;
    paymentStatus: string;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const verifyPayment = async () => {
    if (!sessionId) {
      setError("Payment session ID is missing.");
      setLoading(false);
      return;
    }

    if (!API_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setRetrying(false);

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Please log in again to verify your payment.");
      }

      const headers = {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      };

      // Allow the Stripe webhook time to save the booking.
      for (let attempt = 0; attempt < 15; attempt++) {
        const response = await fetch(
          `${API_URL}/payments/session-status/${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            headers,
            cache: "no-store",
          },
        );

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            responseData.message || "Unable to verify your payment.",
          );
        }

        const paymentResult = responseData.data as PaymentResult;

        if (
          paymentResult.processingStatus === "completed" &&
          paymentResult.paymentStatus === "paid"
        ) {
          setResult(paymentResult);
          setLoading(false);
          return;
        }

        if (paymentResult.processingStatus === "expired") {
          throw new Error("Your Stripe checkout session has expired.");
        }

        setResult(paymentResult);

        if (attempt < 14) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Payment may be successful while the webhook is still processing.
      setRetrying(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while verifying your payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
    // Verify once when the page loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const isCompleted =
    result?.processingStatus === "completed" &&
    result?.paymentStatus === "paid";

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f8f6] px-4 py-16 text-[#202020] dark:bg-[#111111] dark:text-white">
      <section className="w-full max-w-xl rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#1b1b1b] sm:p-12">
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-[#e8e8e8] border-t-[#eab308] dark:border-[#333] dark:border-t-[#eab308]" />

            <h1 className="text-2xl font-bold">Verifying Your Payment</h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Please wait while we verify your Stripe payment and confirm your
              booking. Do not close this page.
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600 dark:bg-red-500/10">
              !
            </div>

            <h1 className="text-2xl font-bold">Payment Verification Failed</h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {error}
            </p>

            <button
              onClick={verifyPayment}
              className="mt-7 rounded-xl bg-[#eab308] px-6 py-3 font-semibold text-black transition hover:bg-[#d6a107]"
            >
              Try Again
            </button>

            <div className="mt-5">
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-black dark:hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </>
        ) : isCompleted ? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600 dark:bg-green-500/10 dark:text-green-400">
              ✓
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
              Payment Successful
            </p>

            <h1 className="mt-3 text-3xl font-bold">Thank You!</h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Your payment has been received successfully.
            </p>

            {result.booking && (
              <div className="mt-8 rounded-2xl bg-[#f8f8f6] p-5 text-left dark:bg-[#252525]">
                <h2 className="mb-4 font-semibold">Booking Details</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Equipment
                    </span>
                    <span className="text-right font-medium">
                      {result.booking.equipmentName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Booking ID
                    </span>
                    <span className="max-w-[65%] break-all text-right font-medium">
                      {result.booking.id}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Booking Status
                    </span>
                    <span className="text-right font-semibold capitalize">
                      {result.booking.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-black/10 pt-3 dark:border-white/10">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Paid
                    </span>
                    <span className="font-bold">
                      {result.payment?.currency?.toUpperCase() || "USD"}{" "}
                      {result.payment?.amount?.toFixed(2) ??
                        result.booking.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {result.booking?.status === "payment_review" && (
              <p className="mt-5 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300">
                Your payment is successful, but the booking requires an
                availability review. The rental team will review it.
              </p>
            )}

            <Link
              href="/"
              className="mt-8 inline-flex rounded-xl bg-[#eab308] px-7 py-3 font-semibold text-black transition hover:bg-[#d6a107]"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
              !
            </div>

            <h1 className="text-2xl font-bold">
              {retrying
                ? "Booking Is Still Processing"
                : "Payment Not Completed"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {retrying
                ? "Your payment may have been received, but booking confirmation is taking longer than expected. Please check again shortly."
                : result?.message || "We could not confirm your payment yet."}
            </p>

            <button
              onClick={verifyPayment}
              className="mt-7 rounded-xl bg-[#eab308] px-6 py-3 font-semibold text-black transition hover:bg-[#d6a107]"
            >
              Check Again
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
