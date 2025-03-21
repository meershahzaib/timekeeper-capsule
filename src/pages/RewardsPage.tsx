
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Medal, Trophy, Gift, Star, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const rewards = [
  {
    title: "First Capsule Created",
    description: "Create your first time capsule",
    icon: Star,
    reward: "50 points",
    progress: 0,
    claimed: false,
  },
  {
    title: "Memory Keeper",
    description: "Store 10 memories in capsules",
    icon: Trophy,
    reward: "100 points",
    progress: 0,
    maxProgress: 10,
    claimed: false,
  },
  {
    title: "Time Traveler",
    description: "Create capsules spanning 5 years total",
    icon: Clock,
    reward: "200 points",
    progress: 0,
    maxProgress: 5,
    claimed: false,
  },
  {
    title: "Sharing is Caring",
    description: "Share a capsule with 3 friends",
    icon: Gift,
    reward: "150 points",
    progress: 0,
    maxProgress: 3,
    claimed: false,
  },
];

export default function RewardsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-24 px-4 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Rewards & Achievements</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Complete actions and earn rewards as you create and share time capsules
          </p>
        </header>
        
        <div className="grid grid-cols-1 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your achievements and points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center bg-muted/40 p-6 rounded-xl w-full md:w-auto">
                  <span className="text-4xl font-bold mb-2">0</span>
                  <span className="text-sm text-muted-foreground">Total Points</span>
                </div>
                
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Level Progress</span>
                    <span className="text-sm text-muted-foreground">0/1000 XP</span>
                  </div>
                  <Progress value={0} className="h-2 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Complete achievements below to earn points and level up
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-6">Available Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <reward.icon className="h-6 w-6 text-primary" />
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
                      <span>{reward.progress}/{reward.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(reward.progress / reward.maxProgress) * 100} 
                      className="h-2" 
                    />
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
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
      </div>
      <Footer />
    </>
  );
}
