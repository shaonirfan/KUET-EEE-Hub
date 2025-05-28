import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, BookCheck, Users, Lightbulb } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Pioneering Electrical & Electronic Engineering at KUET
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Shaping Tomorrow&apos;s EEE Leaders: Dedicated to fostering innovation, critical thinking, and technical mastery within a dynamic learning environment.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="relative h-80 md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl group">
          <Image
            src="https://placehold.co/800x600.png"
            alt="KUET EEE Department - modern university campus or engineering lab"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint="university campus engineering"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Our Mission & Vision</h3>
          <p className="text-foreground/90 leading-relaxed">
            The Department of Electrical and Electronic Engineering (EEE) at Khulna University of Engineering & Technology (KUET) 
            stands as a beacon of academic excellence and innovation. Our mission is to provide students with a comprehensive 
            and cutting-edge education, preparing them to tackle complex challenges and lead in a rapidly evolving technological landscape.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            We pride ourselves on a robust curriculum, state-of-the-art facilities, and a dedicated faculty committed to 
            mentoring the next generation of engineers. Our graduates are equipped with strong theoretical foundations and practical skills, 
            ready to make significant contributions to industry and research worldwide.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <InfoCard icon={<Zap />} title="Innovation Hub" description="Fostering creative solutions and impactful research." />
            <InfoCard icon={<BookCheck />} title="Academic Excellence" description="High-quality education aligned with global standards." />
            <InfoCard icon={<Users />} title="Skilled Faculty" description="Experienced professors guiding future engineers." />
            <InfoCard icon={<Lightbulb />} title="Leadership Development" description="Preparing graduates for influential roles in technology." />
          </div>
        </div>
      </div>
    </section>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <span className="text-primary">{icon}</span>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
