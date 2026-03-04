"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        // Fetch role and redirect to appropriate dashboard
        try {
          const res = await fetch("/api/user/role");
          if (res.ok) {
            const { role } = await res.json();
            if (role === "ADMIN") router.push("/admin");
            else if (role === "ARTISAN") router.push("/artisan");
            else if (role === "CUSTOMER") router.push("/customer");
            else router.push("/onboarding");
          } else {
            router.push("/");
          }
        } catch {
          router.push("/");
        }
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    // Google redirects — LayoutClient will handle role-based routing
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex relative">
      {/* Back Button */}
      <div className="absolute left-0 top-0 z-50">
        {/* UniversalBackButton with fallback to home */}
        <>{require('./SignInBackButton').default()}</>
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
            Artisan&apos;s Loom
          </h1>
          <p className="text-[#E5DCCA]/80 text-lg leading-relaxed">
            Connecting the world with India&apos;s finest handcrafted treasures. Every thread tells a story.
          </p>
          <div className="mt-10 flex justify-center gap-8 text-[#D4AF37]/60 text-sm">
            <span>Handcrafted</span>
            <span>•</span>
            <span>Authentic</span>
            <span>•</span>
            <span>Heritage</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-white overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-cover" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Welcome Back</h2>
            <p className="text-[#8C7B70] mt-2">Sign in to your account to continue</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
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
            <span className="text-sm text-[#8C7B70]">or sign in with email</span>
            <div className="flex-1 h-px bg-[#E5DCCA]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">Email</label>
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
              <label className="block text-sm font-medium text-[#4A3526] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A3526] hover:bg-[#2C1810] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[#8C7B70] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#D4AF37] hover:text-[#B8860B] font-semibold transition-colors">
              Create Account
            </Link>
          </p>

          <p className="text-center text-xs text-[#8C7B70]/60 mt-4">
            By signing in, you agree to our{" "}
            <Link href="/terms-of-service" className="underline">Terms</Link> and{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
