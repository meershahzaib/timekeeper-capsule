
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Transition } from "@/components/ui/Transition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container">
          <GlassCard className="max-w-md mx-auto p-8 text-center">
            <Transition type="scale">
              <div className="w-20 h-20 bg-muted/50 rounded-full mx-auto flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple">
                  404
                </span>
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              
              <p className="text-muted-foreground mb-8">
                The page you are looking for doesn't exist or has been moved.
              </p>
              
              <AnimatedButton 
                className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </AnimatedButton>
            </Transition>
          </GlassCard>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
