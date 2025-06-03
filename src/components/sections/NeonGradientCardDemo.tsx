"use client";

import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import React from "react"; // Added React import

export function NeonGradientCardDemo() {
  return (
    <div className="flex min-h-96 items-center justify-center bg-background p-4">
      <NeonGradientCard className="max-w-sm items-center justify-center text-center">
        <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
          Neon Gradient Card
        </span>
      </NeonGradientCard>
    </div>
  );
}

export default NeonGradientCardDemo;
