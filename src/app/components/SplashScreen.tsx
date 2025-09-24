"use client";

import { useEffect } from "react";
import Image from "next/image";
import Vector from "@/assets/images/shape.svg";
import AnimatedImage from "@/assets/images/todo_list.png";

type SplashProps = {
  duration?: number;
  onFinish?: () => void;
};

export default function SplashScreen({
  duration = 2500,
  onFinish,
}: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="w-full min-h-screen bg-[#F0F4F3] relative">
      <Image
        src={Vector}
        alt="Eclipse Vector image"
        width={200}
        height={100}
        className="absolute top-0 left-0"
      />
      <Image
        src={AnimatedImage}
        alt="An animated man looking up at different checklists"
        width={254}
        height={194}
        className="pt-32 mx-auto"
      />

      <div className="m-6 flex flex-col items-center">
        <h2 className="font-extrabold">Get things done with ToDo</h2>
        <p className="max-w-3xs text-center">
          Create, organize, and complete your tasks in one place.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onFinish?.()}
        className="block bg-[#50C2C9] mx-auto rounded-md p-4 text-white max-w-md w-3/4"
      >
        Get Started
      </button>
    </div>
  );
}
