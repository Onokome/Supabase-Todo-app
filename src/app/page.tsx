"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { supabase } from "@/app/lib/supabaseClient";
import { useState } from "react";
import Todos from "./components/Todos";

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Check your email for a confirmation link!");
  }

  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else setMessage("Signed in!");
  }

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });
    if (error) console.log("Google login error:", error.message);
  };

  if (loading) return <p>Loading...</p>;

   if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Login / Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 block mb-2 w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 block mb-2 w-full"
        />

        <div className="space-x-2">
          <button
            onClick={handleSignup}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign Up
          </button>

          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign In
          </button>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 mt-4 bg-red-500 text-white rounded"
        >
          Sign in with Google
        </button>

        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    )
  }


  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-bold">Todo App</h1>
        <div>
          <span className="mr-3 text-sm">{user.email}</span>
          <button
            onClick={signOut}
            className="px-3 py-1 border rounded text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <Todos user={user} />
      </main>
    </div>
  )
}
