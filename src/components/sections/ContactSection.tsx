
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, Info, Facebook, ExternalLink, MessageCircle, Briefcase, Send, Linkedin } from 'lucide-react'; // Added Linkedin
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Get in Touch or Contribute
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions, suggestions for the website, or want to contribute resources? We&apos;re here to help and appreciate your input.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 lg:gap-12 max-w-2xl mx-auto"> {/* Centered the remaining card */}
          {/* Departmental Information Card Removed */}

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl text-foreground">
                <User className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0" />
                Site Admin & Contributions
              </CardTitle>
              <CardDescription>Contact Shaon Irfan (2k20 Batch) for website issues or resource submissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 mt-1 text-primary shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Roll</h4>
                  <p className="text-sm text-muted-foreground">2003106</p>
                </div>
              </div>
               <div className="flex items-start space-x-3">
                <Send className="h-5 w-5 mt-1 text-primary shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Telegram</h4>
                  <Link href="https://t.me/shaonirfan" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    t.me/shaonirfan
                  </Link>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Facebook className="h-5 w-5 mt-1 text-primary shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Facebook</h4>
                  <Link href="https://www.facebook.com/shaon.irfan" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    facebook.com/shaon.irfan
                  </Link>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Linkedin className="h-5 w-5 mt-1 text-primary shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">LinkedIn</h4>
                  <Link href="https://www.linkedin.com/in/shaon-irfan-ba5b03b4" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    linkedin.com/in/shaon-irfan
                  </Link>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40 mt-4">
                 <h4 className="font-medium text-foreground flex items-center"><Briefcase size={18} className="mr-2 text-primary" /> Contribution Guidance</h4>
                 <p className="text-sm text-muted-foreground mt-1">
                   To contribute resources (notes, slides, job prep materials), please contact the site admin via Telegram. You can share the materials directly or provide a Google Drive link.
                 </p>
                 <Button asChild variant="outline" size="sm" className="mt-3 group">
                  <Link href="https://t.me/shaonirfan" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} className="mr-2" /> Message Admin
                  </Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
