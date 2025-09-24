"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";
import Vector from "@/assets/images/shape.svg";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace("/dashboard");
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          router.replace("/dashboard");
        } else {
          setTimeout(() => {
            router.replace("/signin");
          }, 2000);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen relative bg-[#F0F4F3] flex items-center justify-center">
      <Image
        src={Vector}
        alt="Eclipse Vector image"
        width={200}
        height={100}
        className="absolute top-0 left-0"
      />
      <div className="font-bold text-2xl ">
        <p>Signing you in — please wait…</p>
      </div>
    </div>
  );
}