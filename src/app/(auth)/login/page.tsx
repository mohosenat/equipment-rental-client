"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-black p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent" />

          <div className="relative z-10">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              RENT<span className="text-yellow-400">RO</span>
            </Link>

            <p className="mt-2 text-sm text-white/60">
              Equipment Rental Marketplace
            </p>
          </div>

          <div className="relative z-10 my-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Rent smarter.
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
              Everything you need.
              <span className="mt-2 block text-yellow-400">
                When you need it.
              </span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Access the equipment you need, connect with equipment owners, and
              make every project easier with RENTRO.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-white/50">
            <LockKeyhole size={16} />
            Secure access to your rental account
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10 lg:p-12">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-8 inline-block text-2xl font-extrabold tracking-tight lg:hidden"
          >
            RENT<span className="text-yellow-500">RO</span>
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
              Welcome Back
            </p>

            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Sign in to RENTRO
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Access your account to manage rentals and discover equipment.
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.91 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.2C12.43 13.54 17.74 9.5 24 9.5z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#34A853"
                  d="M46.98 24.55c0-1.57-.15-3.09-.44-4.55H24v9.02h12.93c-.58 2.96-2.25 5.48-4.71 7.18l7.56 5.86c4.42-4.09 7.2-10.12 7.2-17.51z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.2a24 24 0 0 0 0 21.58l7.98-6.2z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.94l-7.56-5.86c-2.1 1.41-4.78 2.24-8.34 2.24-6.26 0-11.57-4.04-13.46-9.68l-7.98 6.2C6.51 43.62 14.62 48 24 48z"
                  transform="translate(0 -4)"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-12 text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-yellow-600 transition hover:text-yellow-500"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
