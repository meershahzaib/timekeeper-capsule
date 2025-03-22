
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserStats {
  capsules_created: number;
  memories_stored: number;
  days_preserved: number;
  total_points: number;
}

interface CapsuleStatsProps {
  userStats: UserStats;
}

export function CapsuleStats({ userStats }: CapsuleStatsProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Capsule Statistics
        </CardTitle>
        <CardDescription>Summary of your time capsule activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="bg-muted/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{userStats.capsules_created}</p>
            <p className="text-sm text-muted-foreground">Active Capsules</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{userStats.memories_stored}</p>
            <p className="text-sm text-muted-foreground">Memories Stored</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{userStats.days_preserved}</p>
            <p className="text-sm text-muted-foreground">Days Preserved</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Rewards Points</span>
            <span className="text-sm text-muted-foreground">{userStats.total_points}/1000</span>
          </div>
          <Progress value={(userStats.total_points / 1000) * 100} className="h-2 mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm" 
              onClick={() => navigate("/rewards")}
            >
              View your achievements
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
