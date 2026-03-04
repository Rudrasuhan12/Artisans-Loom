"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created but sign-in failed. Please sign in manually.");
        router.push("/sign-in");
      } else {
        toast.success("Welcome to Artisan's Loom!");
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex relative">
      {/* Back Button */}
      <div className="absolute left-0 top-0 z-50">
        {/* UniversalBackButton with fallback to home */}
        <>{require('./SignUpBackButton').default()}</>
      </div>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2C1810] via-[#4A3526] to-[#2C1810] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-[#D4AF37] rounded-full" />
          <div className="absolute bottom-32 right-16 w-60 h-60 border border-[#D4AF37]/50 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-[#D4AF37]/30 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-[#D4AF37] bg-white overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={96} height={96} className="object-cover" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Join Artisan&apos;s Loom
          </h1>
          <p className="text-[#E5DCCA]/80 text-lg leading-relaxed">
            Whether you&apos;re an artisan showcasing your craft or a customer seeking authentic handmade treasures — your journey starts here.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">500+</p>
              <p className="text-xs text-[#E5DCCA]/60">Artisans</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">28</p>
              <p className="text-xs text-[#E5DCCA]/60">States</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">50+</p>
              <p className="text-xs text-[#E5DCCA]/60">Crafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-white overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-cover" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Create Account</h2>
            <p className="text-[#8C7B70] mt-2">Start your handcraft journey today</p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#E5DCCA] rounded-xl bg-white hover:bg-gray-50 transition-colors text-[#4A3526] font-medium disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E5DCCA]" />
            <span className="text-sm text-[#8C7B70]">or sign up with email</span>
            <div className="flex-1 h-px bg-[#E5DCCA]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E5DCCA] rounded-xl bg-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors text-[#4A3526] placeholder-[#8C7B70]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E5DCCA] rounded-xl bg-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors text-[#4A3526] placeholder-[#8C7B70]/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-12 py-3 border-2 border-[#E5DCCA] rounded-xl bg-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors text-[#4A3526] placeholder-[#8C7B70]/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7B70] hover:text-[#4A3526] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E5DCCA] rounded-xl bg-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors text-[#4A3526] placeholder-[#8C7B70]/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A3526] hover:bg-[#2C1810] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-[#8C7B70] mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#D4AF37] hover:text-[#B8860B] font-semibold transition-colors">
              Sign In
            </Link>
          </p>

          <p className="text-center text-xs text-[#8C7B70]/60 mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/terms-of-service" className="underline">Terms</Link> and{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
