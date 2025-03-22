
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Reward } from "@/types/rewards";
import { toast } from "sonner";

interface RewardsListProps {
  rewards: Reward[];
  onClaimReward: (reward: Reward) => Promise<void>;
}

export function RewardsList({ rewards, onClaimReward }: RewardsListProps) {
  const [claimingId, setClaimingId] = React.useState<string | null>(null);

  const handleClaim = async (reward: Reward) => {
    if (!reward.claimable) return;
    
    setClaimingId(reward.achievement_type);
    try {
      await onClaimReward(reward);
      toast.success(`Claimed ${reward.points} points!`);
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Failed to claim reward");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rewards.map((reward, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-muted/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${reward.claimed ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  {reward.claimed ? (
                    <Check className="h-6 w-6 text-primary" />
                  ) : (
                    <reward.icon className="h-6 w-6 text-primary" />
                  )}
                </div>
                <CardTitle className="text-lg">{reward.title}</CardTitle>
              </div>
              <div className="text-sm font-medium text-primary">
                {reward.reward}
              </div>
            </div>
            <CardDescription>{reward.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {reward.maxProgress ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{reward.progress || 0}/{reward.maxProgress}</span>
                </div>
                <Progress 
                  value={((reward.progress || 0) / reward.maxProgress) * 100} 
                  className="h-2" 
                />
                {reward.claimable && !reward.claimed && (
                  <Button 
                    variant="default"
                    className="w-full mt-2" 
                    onClick={() => handleClaim(reward)}
                    disabled={claimingId === reward.achievement_type}
                  >
                    {claimingId === reward.achievement_type ? "Claiming..." : "Claim Reward"}
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant={reward.claimed ? "default" : (reward.claimable ? "default" : "outline")}
                className="w-full" 
                disabled={reward.claimed || !reward.claimable}
                onClick={() => handleClaim(reward)}
              >
                {claimingId === reward.achievement_type ? (
                  "Claiming..."
                ) : reward.claimed ? (
                  "Claimed"
                ) : reward.claimable ? (
                  "Claim Reward"
                ) : (
                  "Not Started"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
