
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react" // Changed to 'type' import
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items.length > 0 ? items[0].name : '');
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    handleResize() // Call on initial mount
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Effect to update activeTab based on URL hash for initial load and back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const currentItem = items.find(item => item.url === hash);
      if (currentItem) {
        setActiveTab(currentItem.name);
      } else if (hash === '' || hash === '#') { // Default to first item if hash is empty (e.g. root path)
         if (items.length > 0) setActiveTab(items[0].name);
      }
    };

    handleHashChange(); // Set initial active tab based on current URL hash
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [items]);


  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mt-6 sm:pt-0", // Adjusted sm:pt-6 to sm:mt-6 for consistency and sm:pt-0
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-3 bg-card/60 border border-border backdrop-blur-lg py-1.5 px-1.5 sm:py-2 sm:px-2 rounded-full shadow-xl">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full transition-colors duration-200 ease-in-out",
                "text-muted-foreground hover:text-primary",
                isActive && "text-primary",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={isMobile ? 18 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 sm:w-8 sm:h-1 bg-primary rounded-t-full">
                    <div className="absolute w-10 h-5 sm:w-12 sm:h-6 bg-primary/10 rounded-full blur-md -top-1.5 sm:-top-2 -left-2" />
                    <div className="absolute w-6 h-5 sm:w-8 sm:h-6 bg-primary/10 rounded-full blur-md -top-1 sm:-top-1" />
                    <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-primary/20 rounded-full blur-sm top-0 left-1/2 -translate-x-1/2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

