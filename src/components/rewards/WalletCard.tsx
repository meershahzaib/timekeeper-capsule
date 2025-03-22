
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WalletCardProps {
  rewardPoints: number;
  rewardMultiplier: number;
}

export function WalletCard({ rewardPoints, rewardMultiplier }: WalletCardProps) {
  const { user } = useAuth();
  const baseReward = 0.0002; // Base reward in FIL
  const totalReward = calculateTotalReward(rewardPoints, baseReward, rewardMultiplier);

  const handleWithdraw = async () => {
    if (!user) return;
    
    try {
      toast.info("Processing withdrawal request...");
      // In a real implementation, you would integrate with a Filecoin wallet API
      // For now, we'll simulate a successful withdrawal
      setTimeout(() => {
        toast.success("Withdrawal successful! Tokens have been sent to your wallet.");
      }, 2000);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Withdrawal failed. Please try again later.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Filecoin Wallet
        </CardTitle>
        <CardDescription>
          Earn FIL tokens by completing achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 rounded-lg bg-primary/5">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">{totalReward.toFixed(6)} FIL</p>
          </div>
          <Coins className="h-8 w-8 text-primary opacity-70" />
        </div>
        
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Reward Rate</span>
            <span>{baseReward} FIL per achievement</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Reward Multiplier</span>
            <span>x{rewardMultiplier.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleWithdraw} 
          className="w-full"
          disabled={totalReward <= 0}
        >
          Withdraw to Wallet <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to calculate total reward
function calculateTotalReward(points: number, baseReward: number, multiplier: number): number {
  // Calculate how many achievements have been completed (each 100 points is an achievement)
  const completedAchievements = Math.floor(points / 100);
  return completedAchievements * baseReward * multiplier;
}
