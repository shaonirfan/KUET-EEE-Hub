
'use client'; // Required because NavBar uses hooks like useState, useEffect
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
// import AboutSection from '@/components/sections/AboutSection'; // Removed
import ResourcesSection from '@/components/sections/ResourcesSection';
import OnlineClassRecordingsSection from '@/components/sections/OnlineClassRecordingsSection'; // Added
import ContactSection from '@/components/sections/ContactSection';
import { Separator } from '@/components/ui/separator';
// import ChatbotWidget from '@/components/chatbot/ChatbotWidget'; // Removed
import { NavBar } from "@/components/ui/tubelight-navbar"; // Import NavBar
import { Home, FileText, Mail, PlaySquare } from 'lucide-react'; // Import icons, Added PlaySquare


const navBarItems = [
  { name: 'Home', url: '#hero', icon: Home },
  { name: 'Resources', url: '#resources', icon: FileText },
  { name: 'Recordings', url: '#online-class-recordings', icon: PlaySquare }, // Added
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
        
        <div className="container mx-auto px-4">
          <Separator className="my-8 md:my-12" /> {/* Increased margin */}
        </div>
        <OnlineClassRecordingsSection /> {/* Added */}

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
