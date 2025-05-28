"use client";
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Zap } from 'lucide-react'; // Using Zap as a placeholder logo icon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '#hero', label: 'Home' },
  // { href: '#about', label: 'About EEE' }, // Removed
  { href: '#resources', label: 'Resources' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname(); // Can be used to highlight active section if needed, though not for # links directly

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="KUET EEE Hub Home">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">KUET EEE Hub</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary rounded-md",
                // Example for active state if using full paths: pathname === item.href ? "text-primary bg-primary/10" : ""
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="grid gap-2 text-base font-medium mt-8">
                  <Link href="/" className="flex items-center space-x-2 mb-6 px-2" aria-label="KUET EEE Hub Home">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg text-foreground">KUET EEE Hub</span>
                  </Link>
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
