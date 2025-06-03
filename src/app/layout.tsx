
import type { Metadata } from 'next';
import { Inter, IBM_Plex_Serif } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  variable: '--font-ibm-plex-serif',
  weight: ['400', '700'], // Include bold weight
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
      </head>
      <body className={`${inter.variable} ${ibmPlexSerif.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false} // Changed from true (implicit) to false
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
