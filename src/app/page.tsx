
'use client'; // Required because NavBar uses hooks like useState, useEffect
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
// import AboutSection from '@/components/sections/AboutSection'; // Removed
import ResourcesSection from '@/components/sections/ResourcesSection';
import ContactSection from '@/components/sections/ContactSection';
import { Separator } from '@/components/ui/separator';
// import ChatbotWidget from '@/components/chatbot/ChatbotWidget'; // Removed
import { NavBar } from "@/components/ui/tubelight-navbar"; // Import NavBar
import { Home, FileText, Mail } from 'lucide-react'; // Import icons
// import NeonGradientCardDemo from '@/components/sections/NeonGradientCardDemo'; // Removed


const navBarItems = [
  { name: 'Home', url: '#hero', icon: Home },
  { name: 'Resources', url: '#resources', icon: FileText },
  { name: 'Contact', url: '#contact', icon: Mail },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <NavBar items={navBarItems} /> {/* Add NavBar here */}
      <main className="flex-grow"> {/* Removed pt-12 */}
        <HeroSection />
        {/* <AboutSection /> // Removed */}
        {/* Removed separator that was after AboutSection 
        <div className="container mx-auto px-4">
          <Separator className="my-0 md:my-0" />
        </div> 
        */}
        <ResourcesSection />
        
        {/* Example of using the NeonGradientCardDemo - REMOVED
        <section id="neon-demo" className="py-12">
          <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-8">Neon Card Demo</h2>
            <NeonGradientCardDemo />
          </div>
        </section> 
        */}
        
        <div className="container mx-auto px-4">
          <Separator className="my-8 md:my-12" /> {/* Increased margin */}
        </div>
        <ContactSection />
      </main>
      {/* <ChatbotWidget /> // Removed */}
      <Footer />
    </div>
  );
}
