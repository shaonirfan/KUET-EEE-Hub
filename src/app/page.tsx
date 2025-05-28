import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ResourcesSection from '@/components/sections/ResourcesSection';
import ContactSection from '@/components/sections/ContactSection';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <div className="container mx-auto px-4">
          <Separator className="my-0 md:my-0" /> {/* Reduced margin for tighter integration */}
        </div>
        <ResourcesSection />
        <div className="container mx-auto px-4">
          <Separator className="my-0 md:my-0" /> {/* Reduced margin */}
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
