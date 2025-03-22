
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import FAQ from '@/components/home/FAQ';
import { Transition } from '@/components/ui/Transition';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Floating Theme Toggle */}
      <ThemeToggle variant="floating" />
      
      <main>
        <Hero />
        
        <Features />
        
        <HowItWorks />
        
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
                {user ? (
                  <Link to="/create-capsule">
                    <AnimatedButton 
                      size="lg" 
                      className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
                    >
                      Create Your Time Capsule
                    </AnimatedButton>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <Link to="/create-capsule">
                      <AnimatedButton 
                        size="lg" 
                        className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
                      >
                        Create a Time Capsule
                      </AnimatedButton>
                    </Link>
                    <div>
                      <Link to="/dashboard" className="text-primary hover:underline">
                        Sign up
                      </Link>
                      <span className="mx-2 text-muted-foreground">or</span>
                      <Link to="#how-it-works" className="text-primary hover:underline">
                        Learn How It Works
                      </Link>
                    </div>
                  </div>
                )}
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
