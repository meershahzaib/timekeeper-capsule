
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, Coins, BadgeInfo } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getRewardMultiplier } from "./RewardLevels";

interface WalletCardProps {
  rewardPoints: number;
  userStats: {
    total_points: number;
    accumulated_fil?: number;
    last_accumulation_time?: string;
  };
}

export function WalletCard({ rewardPoints, userStats }: WalletCardProps) {
  const { user } = useAuth();
  const [accumulatedFil, setAccumulatedFil] = useState<number>(userStats.accumulated_fil || 0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const rewardMultiplier = getRewardMultiplier(rewardPoints);
  const baseReward = 0.0002; // Base reward in FIL per 3 hours
  const hourlyRate = (baseReward / 3) * rewardMultiplier;

  useEffect(() => {
    if (!user) return;
    
    // Set the initial accumulated FIL
    setAccumulatedFil(userStats.accumulated_fil || 0);
    
    // Update the accumulated FIL based on time passed since last accumulation
    const updateAccumulation = () => {
      if (!userStats.last_accumulation_time) return;
      
      const lastTime = new Date(userStats.last_accumulation_time).getTime();
      const currentTime = new Date().getTime();
      const hoursPassed = (currentTime - lastTime) / (1000 * 60 * 60);
      
      // Calculate new FIL accumulated since last update
      const newAccumulation = hourlyRate * hoursPassed;
      const updatedTotal = (userStats.accumulated_fil || 0) + newAccumulation;
      
      setAccumulatedFil(updatedTotal);
    };
    
    // Update immediately, then every minute
    updateAccumulation();
    const interval = setInterval(updateAccumulation, 60000);
    
    return () => clearInterval(interval);
  }, [user, userStats, hourlyRate]);

  const handleWithdraw = async () => {
    if (!user) return;
    
    setIsWithdrawing(true);
    try {
      // Update user_stats with the latest accumulated FIL value and reset timer
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          accumulated_fil: 0,
          last_accumulation_time: new Date().toISOString() 
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast.success(`Withdrew ${accumulatedFil.toFixed(6)} FIL to your wallet!`);
      setAccumulatedFil(0);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Withdrawal failed. Please try again later.");
    } finally {
      setIsWithdrawing(false);
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
            <p className="text-2xl font-bold">{accumulatedFil.toFixed(6)} FIL</p>
          </div>
          <Coins className="h-8 w-8 text-primary opacity-70" />
        </div>
        
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Accumulation Rate</span>
            <span>{hourlyRate.toFixed(6)} FIL per hour</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Earnings (est.)</span>
            <span>{(hourlyRate * 24).toFixed(6)} FIL</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Reward Multiplier</span>
            <span>x{rewardMultiplier.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="bg-muted/20 p-3 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <BadgeInfo className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-muted-foreground">
              Filecoin is accumulating in real-time. Complete achievements to increase your earning rate!
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleWithdraw} 
          className="w-full"
          disabled={accumulatedFil <= 0 || isWithdrawing}
        >
          {isWithdrawing ? (
            "Processing..."
          ) : (
            <>Withdraw to Wallet <ArrowUpRight className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
