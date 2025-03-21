
import React from 'react';
import { Transition } from '@/components/ui/Transition';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { cn } from '@/lib/utils';
import { LockKeyhole, Upload, Calendar, Mail } from 'lucide-react';

interface HowItWorksProps {
  className?: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ className }) => {
  const steps = [
    {
      icon: <Upload className="h-6 w-6 text-white" />,
      color: "bg-time-blue",
      title: "Create & Upload",
      description: "Upload your photos, videos, messages or documents to your personal time capsule."
    },
    {
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "bg-time-purple",
      title: "Set the Date",
      description: "Choose when your capsule will be unlocked, from days to decades in the future."
    },
    {
      icon: <LockKeyhole className="h-6 w-6 text-white" />,
      color: "bg-time-teal",
      title: "Secure & Seal",
      description: "Your content is encrypted and securely stored until the scheduled unlock date."
    },
    {
      icon: <Mail className="h-6 w-6 text-white" />,
      color: "bg-time-rose",
      title: "Deliver & Discover",
      description: "Recipients receive notification when the time capsule is ready to be opened."
    }
  ];

  return (
    <section id="how-it-works" className={cn(
      "py-20 relative bg-muted/30", 
      className
    )}>
      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-time-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-time-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <Transition type="fade">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center mb-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How TimeSeal 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple"> Works</span>
            </h2>
            <p className="text-muted-foreground">
              Creating and sharing time capsules is easy with our streamlined process, designed for simplicity and security.
            </p>
          </div>
        </Transition>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <Transition key={index} type="scale" delay={100 + index * 100}>
                <div className="relative flex flex-col items-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-6 relative z-10",
                    step.color
                  )}>
                    {step.icon}
                    <div className={cn(
                      "absolute -inset-2 rounded-full opacity-20 animate-pulse",
                      step.color
                    )} />
                  </div>
                  <span className="absolute top-16 text-sm font-medium bg-background px-2 text-muted-foreground">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center">{step.description}</p>
                </div>
              </Transition>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Transition type="scale" delay={600}>
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
  );
};

export default HowItWorks;
