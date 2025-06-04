
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaySquare } from 'lucide-react';

export default function OnlineClassRecordingsSection() {
  return (
    <section id="online-class-recordings" className="container mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          Online Class Recordings
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Access recordings of online classes and lectures. This section is under construction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder content - to be replaced with actual recording listings */}
        {[1, 2, 3].map((item) => (
          <Card key={item} className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlaySquare className="mr-2 h-5 w-5 text-primary" />
                Placeholder Recording {item}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Details about this recording will appear here. Content is being organized.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
