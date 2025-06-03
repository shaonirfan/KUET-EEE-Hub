
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
// Removed NeuralNoiseBackground import

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
  weight: ['400', '500', '600', '700'], 
});

export const metadata: Metadata = {
  title: 'KUET EEE Hub',
  description: 'Your Hub for KUET EEE Success: Course Materials, Job Prep, and Department Insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Removed Bree Serif as Inter is primary and mockup also uses Inter predominantly */}
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Removed NeuralNoiseBackground component usage */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // Users can still choose light/dark explicitly
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
