
"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Send } from 'lucide-react';
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import React from "react"; // Added React import for JSX

export default function HeroSection() {
  const handleChatClick = () => {
    // Find and click the expandable chat toggle button
    // The button is a rounded button with either Bot or X icon
    const chatToggle = document.querySelector('button.w-14.h-14.rounded-full');
    
    if (chatToggle instanceof HTMLElement) {
      chatToggle.click();
    }
  };

  return (
    // The <section id="hero"> and outer styling is removed as AuroraBackground provides its own structure
    // The pt-16 pb-20 etc. paddings are also removed; AuroraBackground centers content by default in its h-[100vh]
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center" // Added text-center
      >
        {/* Original h1 and p, adapted to the demo's style */}
        <h1 className="font-serif text-4xl tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-snug dark:text-white">
           <span className="text-primary dark:text-primary">KUET EEE Hub:</span> All Your Essential Resources - One Click Away.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto dark:text-neutral-200">
          Your direct path to essential course materials and insights into our leading EEE program.
        </p>
        
        {/* Original buttons, kept structure but they will be children of motion.div */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="group shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
            <Link href="#resources">
              Find Course Resources
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button 
            onClick={handleChatClick}
            variant="outline" 
            size="lg" 
            className="group shadow-md hover:shadow-accent/30 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 bg-transparent dark:bg-transparent border-foreground/50 hover:border-primary dark:border-white/50 dark:hover:border-primary text-foreground dark:text-white hover:text-primary dark:hover:text-primary"
          >
            Chat with AI Powered Bot
            <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </Button>
        </div>

        {/* Example "Debug now" button from demo - commented out or adapt as needed */}
        {/* <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 mt-4">
          Debug now
        </button> */}
      </motion.div>
    </AuroraBackground>
  );
}
