
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Transition } from '@/components/ui/Transition';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Upload, Lock, Mail } from 'lucide-react';

interface TimeCapsuleCreatorProps {
  className?: string;
}

const TimeCapsuleCreator: React.FC<TimeCapsuleCreatorProps> = ({ className }) => {
  const [step, setStep] = useState(1);
  const [capsuleType, setCapsuleType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step + 1);
    }, 800);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateCapsule = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Here you would handle the actual capsule creation
      setStep(4); // Success step
    }, 1200);
  };

  const getProgress = () => {
    return ((step - 1) / 3) * 100;
  };

  return (
    <GlassCard className={cn("max-w-xl mx-auto p-6", className)}>
      <div className="mb-8">
        <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-time-blue to-time-purple rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Details</span>
          <span>Content</span>
          <span>Schedule</span>
          <span>Complete</span>
        </div>
      </div>

      {step === 1 && (
        <Transition type="scale" key="step1">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium mb-2">Create Your Time Capsule</h3>
              <p className="text-muted-foreground">
                Start by naming your capsule and giving it purpose
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capsule-name">Capsule Name</Label>
                <Input id="capsule-name" placeholder="My Digital Legacy" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capsule-description">Description</Label>
                <Textarea 
                  id="capsule-description" 
                  placeholder="What memories would you like to preserve?"
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Capsule Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={capsuleType === "personal" ? "default" : "outline"}
                    type="button"
                    className={cn(
                      "h-auto py-4 justify-start text-left space-y-1",
                      capsuleType === "personal" ? "border-primary" : ""
                    )}
                    onClick={() => setCapsuleType("personal")}
                  >
                    <div className="font-medium">Personal</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      For your future self
                    </div>
                  </Button>
                  <Button
                    variant={capsuleType === "legacy" ? "default" : "outline"}
                    type="button"
                    className={cn(
                      "h-auto py-4 justify-start text-left space-y-1",
                      capsuleType === "legacy" ? "border-primary" : ""
                    )}
                    onClick={() => setCapsuleType("legacy")}
                  >
                    <div className="font-medium">Legacy</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      For future generations
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <AnimatedButton 
                onClick={handleNext} 
                disabled={isLoading || !capsuleType} 
                className="w-1/3"
              >
                {isLoading ? "Processing..." : "Next Step"}
              </AnimatedButton>
            </div>
          </div>
        </Transition>
      )}

      {step === 2 && (
        <Transition type="scale" key="step2">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium mb-2">Add Your Content</h3>
              <p className="text-muted-foreground">
                Upload media and messages to preserve
              </p>
            </div>

            <div 
              className="bg-muted/50 border-2 border-dashed border-muted rounded-xl p-8 text-center cursor-pointer hover:bg-muted/70 transition-colors"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">Upload Files</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images, videos, audio, and documents
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-to-future">Message to the Future</Label>
              <Textarea 
                id="message-to-future" 
                placeholder="What would you like to say to the recipient of this time capsule?"
                className="min-h-24"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="w-1/3"
              >
                Back
              </Button>
              <AnimatedButton 
                onClick={handleNext} 
                disabled={isLoading} 
                className="w-1/3"
              >
                {isLoading ? "Processing..." : "Next Step"}
              </AnimatedButton>
            </div>
          </div>
        </Transition>
      )}

      {step === 3 && (
        <Transition type="scale" key="step3">
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium mb-2">Schedule Delivery</h3>
              <p className="text-muted-foreground">
                Choose when your time capsule will be unlocked
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Scheduled Opening Date</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input type="date" className="pl-10" />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="relative">
                    <Input type="time" className="pl-10" />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-email">Recipient Email</Label>
                <div className="relative">
                  <Input id="recipient-email" type="email" placeholder="email@example.com" className="pl-10" />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll notify this address when your capsule is ready to be opened
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-muted flex items-start gap-3">
                <div className="mt-0.5">
                  <Lock className="h-5 w-5 text-time-purple" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">End-to-End Encryption</h4>
                  <p className="text-xs text-muted-foreground">
                    Your content is securely encrypted and can only be accessed after the scheduled date
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="w-1/3"
              >
                Back
              </Button>
              <AnimatedButton 
                onClick={handleCreateCapsule} 
                disabled={isLoading} 
                className="w-1/3 bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
              >
                {isLoading ? "Creating..." : "Seal Capsule"}
              </AnimatedButton>
            </div>
          </div>
        </Transition>
      )}

      {step === 4 && (
        <Transition type="scale" key="step4">
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-medium mb-2">Time Capsule Sealed!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your memories are now safely preserved and will be delivered at the scheduled time
              </p>
            </div>

            <div className="pt-6">
              <AnimatedButton 
                onClick={() => setStep(1)} 
                className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
              >
                Create Another Capsule
              </AnimatedButton>
            </div>
          </div>
        </Transition>
      )}
    </GlassCard>
  );
};

export default TimeCapsuleCreator;
