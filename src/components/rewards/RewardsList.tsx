
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Reward } from "@/types/rewards";

interface RewardsListProps {
  rewards: Reward[];
}

export function RewardsList({ rewards }: RewardsListProps) {
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
              </div>
            ) : (
              <Button 
                variant={reward.claimed ? "default" : "outline"} 
                className="w-full" 
                disabled={true}
              >
                {reward.claimed ? "Claimed" : "Not Started"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
