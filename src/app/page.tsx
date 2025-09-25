"use client";
import Link from "next/link";
import Image from "next/image";

import Vector from "@/assets/images/shape.svg";
import GoogleIcon from "@/assets/images/google-colored.svg";
import SplashScreen from "./components/SplashScreen";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

import { Eye, Check, EyeClosed } from "lucide-react";

export default function Home() {
  const hasSeenSplash = sessionStorage.getItem("hasSeenSplash") === "true";
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (showSplash) {
    sessionStorage.setItem("hasSeenSplash", "true"); 
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const isFormValid = () => {
    return (
      email &&
      password &&
      confirmPassword &&
      !passwordError &&
      !confirmPasswordError &&
      password === confirmPassword
    );
  };


  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (!isFormValid()) {
      setMessage("Please fix the errors above before submitting");
      return;
    }

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

   const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F4F3] relative pb-2">
      {showSplash ? (
        <SplashScreen duration={2500} onFinish={handleSplashFinish} />
      ) : (
        <div
          className="min-h-screen bg-left-top bg-no-repeat bg-auto"
          style={{ backgroundImage: `url(${Vector.src})` }}
        >
          <main className="pt-20 px-4 md:max-w-md lg:max-w-lg mx-auto">
            <div className="">
              <h1 className="font-bold text-center text-2xl">Welcome!</h1>
              <p className="text-center text-lg">
                Let&apos;s help to meet up your tasks
              </p>
            </div>
            <form onSubmit={handleSignup} className="mt-6 mb-4" noValidate>
                    {/* Email Field */}
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
              
              {/* Password field */}
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
                    validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  className={`bg-white rounded-3xl py-3 px-4 block w-full border focus:ring-2 focus:ring-[#50C2C9] focus:outline-none transition-colors pr-12 ${
                    passwordError ? "border-red-300" : "border-gray-300 focus:border-[#50C2C9]"
                  }`}
                  required
                  aria-required="true"
                  autoComplete="new-password"
                  minLength={6}
                  aria-describedby={passwordError ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#50C2C9] rounded p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeClosed size={15}/> : <Eye size={15}/>}
                </button>
                {passwordError && (
                  <div id="password-error" className="text-red-600 text-sm mt-1 ml-4">
                    {passwordError}
                  </div>
               )}
              </div>

              {/* Confirm Password Field with Toggle */}
              <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(e.target.value);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  className={`bg-white rounded-3xl py-3 px-4 block w-full border focus:ring-2 focus:ring-[#50C2C9] focus:outline-none transition-colors pr-12 ${
                    confirmPasswordError ? "border-red-300" : "border-gray-300 focus:border-[#50C2C9]"
                  }`}
                  required
                  aria-required="true"
                  autoComplete="new-password"
                  aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#50C2C9] rounded p-1"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeClosed size={15}/> : <Eye size={15}/>}
                </button>
                {confirmPasswordError && (
                  <div id="confirm-password-error" className="text-red-600 text-sm mt-1 ml-4">
                    {confirmPasswordError}
                  </div>
                )}
              </div>

              {message && (
              <div 
                role="alert"
                aria-live="polite"
                className={`text-center text-sm mt-4 p-3 rounded border ${
                  message.includes("confirmation link") 
                    ? "text-green-700 bg-green-50 border-green-200" 
                    : "text-red-700 bg-red-50 border-red-200"
                }`}
              >
                {message}
              </div>
            )}

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full flex justify-center items-center gap-2 rounded-md p-3 mt-6 text-white font-medium hover:cursor-pointer transition-colors ${
                  isSubmitting || isSubmitted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#50C2C9] hover:bg-[#3da7ae] focus:ring-2 focus:ring-[#50C2C9] focus:outline-none focus:ring-offset-2"
                }`}
                aria-live="polite"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
                    <span>Registering...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <span aria-hidden="true"> <Check size={16} /></span>
                    <span>Registered</span>
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="flex items-center my-6" aria-hidden="true">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
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
            
            <p className="mt-6 text-center mx-auto text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/signin" 
                className="text-[#50C2C9] hover:text-[#3da7ae] underline font-medium focus:outline-none focus:ring-2 focus:ring-[#50C2C9] focus:ring-offset-2 rounded p-1 transition-colors"
              >
                Sign In
              </Link>
            </p>
            </main>
        </div>
      )}
    </div>
  );
}
