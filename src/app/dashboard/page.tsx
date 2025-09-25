"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import Todos from "../components/Todos";
import Vector from "@/assets/images/shape.svg";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-[#50C2C9] border-t-transparent rounded-full"
            aria-hidden="true"
          ></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F0F4F3] flex flex-col">
      {/* Header */}
      <header
        className="h-40 shadow-sm bg-left-top bg-no-repeat bg-auto bg-[#50C2C9]"
        style={{ backgroundImage: `url(${Vector.src})` }}
      >
        <div className="max-w-5xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold text-gray-900"
                tabIndex={0}
              >
                Welcome back, {user.email?.split("@")[0]}!
              </h1>
              <p className="mt-1">Manage your tasks efficiently</p>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center text-xs md:text-base gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label={isSigningOut ? "Signing out..." : "Sign out"}
            >
              {isSigningOut ? (
                <>
                  <span
                    className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    aria-hidden="true"
                  ></span>
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="w-8 h-8" />
                  Sign out
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Todos user={user} />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2025 ToDo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
