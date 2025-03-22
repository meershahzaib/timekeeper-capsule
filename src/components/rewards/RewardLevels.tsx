
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";

interface RewardLevelsProps {
  totalPoints: number;
}

export function RewardLevels({ totalPoints }: RewardLevelsProps) {
  // Define reward levels
  const levels = [
    { name: "Bronze", threshold: 100, multiplier: 1.1 },
    { name: "Silver", threshold: 300, multiplier: 1.2 },
    { name: "Gold", threshold: 500, multiplier: 1.3 },
    { name: "Platinum", threshold: 800, multiplier: 1.5 },
    { name: "Diamond", threshold: 1200, multiplier: 2.0 },
  ];

  // Find current level
  const currentLevel = levels.reduce((current, level, index) => {
    if (totalPoints >= level.threshold) {
      return index;
    }
    return current;
  }, -1);

  // Calculate next level progress
  const nextLevel = currentLevel + 1 < levels.length ? currentLevel + 1 : currentLevel;
  const prevThreshold = currentLevel >= 0 ? levels[currentLevel].threshold : 0;
  const nextThreshold = nextLevel < levels.length ? levels[nextLevel].threshold : prevThreshold;
  const progressToNextLevel = nextThreshold > prevThreshold
    ? ((totalPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100
    : 100;

  // Get current multiplier
  const currentMultiplier = currentLevel >= 0 ? levels[currentLevel].multiplier : 1.0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Reward Levels
        </CardTitle>
        <CardDescription>
          Increase your reward rate by earning achievement points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-medium">
                {currentLevel >= 0 ? levels[currentLevel].name : "No Level"} Rewards
              </span>
              <span className="text-sm font-medium text-primary">
                {currentMultiplier.toFixed(1)}x
              </span>
            </div>
            <Progress 
              value={progressToNextLevel} 
              className="h-2"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{totalPoints} points</span>
              {nextLevel < levels.length && (
                <span>Next: {levels[nextLevel].name} ({levels[nextLevel].multiplier.toFixed(1)}x) at {levels[nextLevel].threshold} points</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-2">All Reward Levels</h4>
          <div className="grid gap-2">
            {levels.map((level, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${totalPoints >= level.threshold ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <span className={totalPoints >= level.threshold ? 'font-medium' : 'text-muted-foreground'}>
                    {level.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{level.multiplier.toFixed(1)}x</span>
                  <span className="text-xs text-muted-foreground">{level.threshold}+ points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get the reward multiplier based on points
export function getRewardMultiplier(totalPoints: number): number {
  if (totalPoints >= 1200) return 2.0; // Diamond
  if (totalPoints >= 800) return 1.5;  // Platinum
  if (totalPoints >= 500) return 1.3;  // Gold
  if (totalPoints >= 300) return 1.2;  // Silver
  if (totalPoints >= 100) return 1.1;  // Bronze
  return 1.0; // Base multiplier
}
