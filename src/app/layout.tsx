import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Make sure to use this variable in tailwind.config.ts if extending fontFamily
  weight: ['400', '500', '600', '700'], // Regular, Medium, SemiBold, Bold
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
      <body className={`${inter.className} antialiased`}> {/* Use inter.className directly */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
