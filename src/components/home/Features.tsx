
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Transition } from '@/components/ui/Transition';
import { cn } from '@/lib/utils';
import { Lock, Clock, Upload, Mail, Calendar, Key } from 'lucide-react';

interface FeaturesProps {
  className?: string;
}

const Features: React.FC<FeaturesProps> = ({ className }) => {
  const features = [
    {
      icon: <Lock className="h-6 w-6 text-time-blue" />,
      title: "End-to-End Encryption",
      description: "Your memories are encrypted and can only be accessed when your time capsule is unlocked."
    },
    {
      icon: <Clock className="h-6 w-6 text-time-purple" />,
      title: "Customizable Release Dates",
      description: "Schedule your time capsule to unlock on specific dates, from days to decades in the future."
    },
    {
      icon: <Upload className="h-6 w-6 text-time-teal" />,
      title: "Multi-Format Support",
      description: "Store photos, videos, audio recordings, documents, and text messages in one secure place."
    },
    {
      icon: <Mail className="h-6 w-6 text-time-rose" />,
      title: "Automated Notifications",
      description: "Recipients are alerted when your time capsule is ready to be opened."
    },
    {
      icon: <Calendar className="h-6 w-6 text-time-blue" />,
      title: "Legacy Planning",
      description: "Create capsules for future generations and special occasions like birthdays or anniversaries."
    },
    {
      icon: <Key className="h-6 w-6 text-time-purple" />,
      title: "Secure Access Controls",
      description: "Choose who can access your time capsule and under what conditions."
    }
  ];

  return (
    <section id="features" className={cn("py-20 relative", className)}>
      {/* Background Elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-time-teal/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container relative z-10">
        <Transition type="fade">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center mb-3 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              <span>What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preserve Your Legacy 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple"> Digitally</span>
            </h2>
            <p className="text-muted-foreground">
              TimeSeal combines cutting-edge security with intuitive design to create the perfect digital time capsule solution.
            </p>
          </div>
        </Transition>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Transition key={index} type="scale" delay={100 + index * 100}>
              <GlassCard className="p-6 h-full">
                <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            </Transition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
