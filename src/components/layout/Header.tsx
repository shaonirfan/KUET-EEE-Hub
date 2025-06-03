"use client";
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Zap } from 'lucide-react';
// Removed Button, Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, Menu, usePathname, cn
// Removed navItems array

export default function Header() {
  // const pathname = usePathname(); // No longer needed for direct nav items here

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="KUET EEE Hub Home">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">KUET EEE Hub</span>
        </Link>
        
        {/* Navigation is now handled by NavBar component in page.tsx */}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile menu (Sheet) is removed as NavBar handles mobile navigation */}
        </div>
      </div>
    </header>
  );
}
