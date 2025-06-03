
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Send } from 'lucide-react'; // Added Send icon

export default function HeroSection() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-background pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-36">
      {/* Background decorative gradient */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/40 via-accent/40 to-secondary/40 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-serif text-4xl tracking-normal text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-snug [text-shadow:0_1px_3px_rgba(0,0,0,0.1)] dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
          <span className="text-primary">KUET EEE Hub:</span> All Your Essential Resources - One Click Away.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto">
          Your direct path to essential course materials, job preparation resources, and insights into our leading EEE program.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="group shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
            <Link href="#resources">
              Find Course Resources
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group shadow-md hover:shadow-accent/30 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
            <Link href="https://t.me/eee_20_bot" target="_blank" rel="noopener noreferrer">
              Chat with EEE Bot
              <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Optional subtle background image if needed, ensure it works with gradient */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.02]">
           <Image
            src="https://placehold.co/1920x1080.png?a=1" 
            alt="Abstract technology pattern"
            layout="fill"
            objectFit="cover"
            className="pointer-events-none"
            data-ai-hint="subtle circuit pattern"
            priority
          />
      </div>
    </section>
  );
}
