"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";
import Vector from "@/assets/images/shape.svg";
import GoogleIcon from "@/assets/images/google-colored.svg";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      router.replace("/dashboard");
      setIsSubmitting(false);
    }
  };

  async function handleGoogleSignIn() {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div
      className="w-full bg-[#F0F4F3] min-h-screen bg-left-top bg-no-repeat bg-auto pb-2"
      style={{ backgroundImage: `url(${Vector.src})` }}
    >
      <main className="pt-20 px-4 md:max-w-md lg:max-w-lg mx-auto">
        <div className="">
          <h1 className="font-bold text-center text-2xl">Welcome Back!</h1>
          <p className="text-center text-lg">
            Sign in to continue managing your tasks
          </p>
        </div>

        <form onSubmit={handleSignIn} className="mt-6 mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white rounded-3xl py-3 px-4 block w-full border border-gray-300 focus:border-[#50C2C9] focus:ring-2 focus:ring-[#50C2C9] focus:outline-none transition-colors"
              required
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-white rounded-3xl py-3 px-4 block w-full border border-gray-300 focus:border-[#50C2C9] focus:ring-2 focus:ring-[#50C2C9] focus:outline-none transition-colors"
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#50C2C9] rounded p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeClosed size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 rounded-md p-3 mt-6 text-white bg-[#50C2C9] font-medium hover:cursor-pointer hover:bg-[#3da7ae]  transition-colors "
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="flex items-center my-6" aria-hidden="true">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-3 mt-2 bg-[#6a6e6dff] text-white rounded flex items-center justify-center gap-3 hover:cursor-pointer hover:bg-[#5a5e5d] focus:outline-none focus:ring-2 focus:ring-[#6a6e6d] focus:ring-offset-2 transition-colors"
          aria-label="Sign up with Google"
        >
          <Image
            src={GoogleIcon}
            alt=""
            width={20}
            height={10}
            aria-hidden="true"
          />
          Sign up with Google
        </button>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <p className="mt-6 text-center mx-auto text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/"
            className="text-[#50C2C9] hover:text-[#3da7ae] underline font-medium focus:outline-none focus:ring-2 focus:ring-[#50C2C9] focus:ring-offset-2 rounded p-1 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}
