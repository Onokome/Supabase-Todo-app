"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";
import Vector from '@/assets/images/shape.svg'
import Link from "next/link";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

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
    } else {
         router.replace("/dashboard")
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
    <div className="w-full min-h-screen bg-[#F0F4F3] relative">
        <Image
            src={Vector}
            alt="Eclipse Vector image"
            width={200}
            height={100}
            className="absolute top-0 left-0"
        />
       <main className="pt-32 px-4 md:max-w-md lg:max-w-lg mx-auto">
            <div className="">
              <h1 className="font-bold text-center">Welcome Back!</h1>
              <p className="text-center">Sign in to continue</p>
            </div>

               {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 rounded-md p-2 mt-6 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Image 
                src="/google-icon.svg" 
                alt="Google" 
                width={20} 
                height={20} 
              />
              Sign in with Google
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSignIn} className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white rounded-3xl py-2 px-4 block mb-4 w-full"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white rounded-3xl py-2 px-4 block mb-4 w-full"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-md p-2 mt-6 text-white bg-[#50C2C9] hover:bg-[#3da7ae] disabled:bg-gray-400"
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

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
            
            <p className="mt-2 text-center mx-auto">
              Don&apos;t have an account?{" "}
              <Link href="/" className="text-blue-600 underline">
                Sign Up
              </Link>
            </p>

        </main> 

      <form onSubmit={handleSignIn} className="space-y-4">
        <h1 className="text-xl font-bold">Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Sign in
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
