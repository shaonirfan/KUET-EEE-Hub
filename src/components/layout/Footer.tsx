'use client';

import Link from 'next/link';
import { Zap, Facebook, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | string>('...');
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('Loading...');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setLastUpdatedDate(format(new Date(), "MMMM d, yyyy"));
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-3" aria-label="KUET EEE Hub Home">
              <Zap className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">KUET EEE Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Your central source for Electrical & Electronic Engineering resources at Khulna University of Engineering & Technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {/* <li><Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About KUET EEE</Link></li> // Removed */}
              <li><Link href="#resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">Course Resources</Link></li>
              <li><Link href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact & Contributions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3 text-foreground">Official Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.kuet.ac.bd/dept/eee" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center" target="_blank" rel="noopener noreferrer">
                  EEE Department <ExternalLink size={14} className="ml-1" />
                </Link>
              </li>
              <li>
                <Link href="https://www.kuet.ac.bd" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center" target="_blank" rel="noopener noreferrer">
                  KUET Main Site <ExternalLink size={14} className="ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 mt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} KUET EEE Department. All rights reserved.</p>
          <p className="mt-1">
            This website is a student-led initiative. For official information, please refer to the KUET EEE Department page.
          </p>
          <p className="mt-1">Last Updated: {lastUpdatedDate}</p>
        </div>
      </div>
    </footer>
  );
}
