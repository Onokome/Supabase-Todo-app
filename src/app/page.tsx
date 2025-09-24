"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Vector from "@/assets/images/shape.svg";
import GoogleIcon from "@/assets/images/google-colored.svg";
import SplashScreen from "./components/SplashScreen";
import { supabase } from "@/app/lib/supabaseClient";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }
    setMessage(
      "Please click the confirmation link sent to your email to continue"
    );
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F4F3] relative">
      {showSplash ? (
        <SplashScreen duration={2500} onFinish={() => setShowSplash(false)} />
      ) : (
        <div className="min-h-screen bg-left-top bg-no-repeat bg-auto"
            style={{ backgroundImage: `url(${Vector.src})` }}

        >
          {/* <Image
            src={Vector}
            alt="Eclipse Vector image"
            width={200}
            height={100}
            className="absolute top-0 left-0"
          /> */}
          <main className="pt-20 px-4 md:max-w-md lg:max-w-lg mx-auto">
            <div className="">
              <h1 className="font-bold text-center">Welcome!</h1>
              <p className="text-center">
                Let&apos;s help to meet up your tasks
              </p>
            </div>
            <form onSubmit={handleSignup} className="mt-6 mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white rounded-3xl py-2 px-4 block mb-4 w-full"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white rounded-3xl py-2 px-4 block mb-4 w-full"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white rounded-3xl py-2 px-4 block mb-4 w-full"
              />

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full flex justify-center items-center gap-2 rounded-md p-2 mt-6 text-white ${
                  isSubmitting || isSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#50C2C9] hover:bg-[#3da7ae]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Registering...
                  </>
                ) : isSubmitted ? (
                  <>
                    <span>✔️</span> Registered
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full px-4 py-2 mt-2 bg-[#6a6e6dff] text-white rounded flex items-center justify-center gap-3"
            >
              <Image
                src={GoogleIcon}
                alt="Google Icon"
                width={20}
                height={10}
              />
              Sign up with Google
            </button>

            {message && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}
            <p className="mt-2 text-center mx-auto">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 underline">
                Sign In
              </Link>
            </p>
          </main>
        </div>
      )}
    </div>
  );
}
