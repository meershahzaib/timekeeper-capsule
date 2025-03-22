
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import FAQ from '@/components/home/FAQ';
import TimeCapsuleCreator from '@/components/ui/TimeCapsuleCreator';
import { Transition } from '@/components/ui/Transition';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Floating Theme Toggle */}
      <ThemeToggle variant="floating" />
      
      <main>
        <Hero />
        
        <Features />
        
        <HowItWorks />
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-time-purple/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-time-blue/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container relative z-10">
            <Transition type="fade">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="inline-flex items-center mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <span>Get Started</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Create Your First 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple"> Time Capsule</span>
                </h2>
                <p className="text-muted-foreground">
                  Preserve your memories, messages, and media in just a few simple steps.
                </p>
              </div>
            </Transition>
            
            <Transition type="scale" delay={200}>
              <TimeCapsuleCreator />
            </Transition>
          </div>
        </section>
        
        <FAQ />
        
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-time-blue/10 to-time-purple/10">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Transition type="scale">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to preserve your memories for the future?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of people creating digital time capsules for themselves and future generations.
                </p>
                <AnimatedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
                >
                  Create Your Time Capsule
                </AnimatedButton>
              </Transition>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
