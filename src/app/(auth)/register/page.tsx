"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  LockKeyhole,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type RegisterRole = "customer" | "owner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>("customer");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      setError(
        "Password must contain at least 6 characters, one uppercase and one lowercase letter.",
      );
      return;
    }

    if (photoURL.trim()) {
      try {
        const parsedURL = new URL(photoURL);

        if (!["http:", "https:"].includes(parsedURL.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setError("Please enter a valid profile photo URL.");
        return;
      }
    }

    try {
      setLoading(true);

      const signUpData = {
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
        role,
      };

      const result = await authClient.signUp.email(
        signUpData as Parameters<typeof authClient.signUp.email>[0],
      );

      if (result.error) {
        setError(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      router.push("/login?registered=true");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
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
              Join RENTRO.
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
              Your next project.
              <span className="mt-2 block text-yellow-400">Starts here.</span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Create your account, explore equipment, connect with owners, and
              get everything you need for your next project.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-white/50">
            <LockKeyhole size={16} />
            Create your secure rental account
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
              Get Started
            </p>

            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Join RENTRO and discover a smarter way to rent equipment.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>

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

            {/* Photo URL */}
            <div>
              <label
                htmlFor="photoURL"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Profile Photo URL
                <span className="ml-2 text-xs text-muted-foreground">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <ImageIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="photoURL"
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Select Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    role === "customer"
                      ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400/20"
                      : "border-border bg-background hover:border-yellow-400/50"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      role === "customer"
                        ? "bg-yellow-400 text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Customer
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rent equipment
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    role === "owner"
                      ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400/20"
                      : "border-border bg-background hover:border-yellow-400/50"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      role === "owner"
                        ? "bg-yellow-400 text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Owner
                    </p>
                    <p className="text-xs text-muted-foreground">
                      List equipment
                    </p>
                  </div>
                </button>
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

              <p className="mt-2 text-xs text-muted-foreground">
                Minimum 6 characters with uppercase and lowercase letters.
              </p>
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
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-yellow-600 transition hover:text-yellow-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
