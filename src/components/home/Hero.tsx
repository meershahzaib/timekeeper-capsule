
import React from 'react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Transition } from '@/components/ui/Transition';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { Clock, Lock, Calendar } from 'lucide-react';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn(
      "pt-36 pb-20 overflow-hidden relative", 
      className
    )}>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-time-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-time-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <Transition type="scale" delay={100}>
              <div className="inline-flex items-center mb-6 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span>Preserving memories for the future</span>
              </div>
            </Transition>
            
            <Transition type="scale" delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Create your digital
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple"> time capsule</span>
              </h1>
            </Transition>
            
            <Transition type="scale" delay={300}>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Securely preserve your memories, messages, and media 
                for future retrieval with TimeSeal's advanced encryption technology.
              </p>
            </Transition>
            
            <Transition type="scale" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <AnimatedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
                >
                  Create a Time Capsule
                </AnimatedButton>
                <AnimatedButton 
                  variant="outline" 
                  size="lg"
                >
                  How It Works
                </AnimatedButton>
              </div>
            </Transition>
            
            <Transition type="scale" delay={500}>
              <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded-full border-2 border-background ${
                          ['bg-time-blue', 'bg-time-purple', 'bg-time-teal'][i]
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">2,500+</span> capsules created
                  </p>
                </div>
                <div className="w-px h-6 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-time-purple" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">End-to-end</span> encryption
                  </p>
                </div>
              </div>
            </Transition>
          </div>
          
          <div className="flex-1 relative">
            <Transition type="fade" delay={600}>
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-time-blue/20 to-time-purple/20 rounded-2xl blur-2xl transform -rotate-6 scale-95" />
                <GlassCard className="p-6 overflow-visible relative" borderEffect={false}>
                  <div className="absolute -top-4 -right-4 bg-time-blue text-white p-2 rounded-lg flex items-center gap-2 shadow-lg">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Opens: Jan 1, 2025</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-2">Family Memories 2023</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A collection of our favorite moments from the past year.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className="aspect-square bg-muted rounded-md overflow-hidden"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-time-purple" />
                        <span className="text-xs text-muted-foreground">Encrypted</span>
                      </div>
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-time-purple rounded-full" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
