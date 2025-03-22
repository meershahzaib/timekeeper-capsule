import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Medal, Trophy, Gift, Star, Clock, Award, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const defaultRewards = [
  {
    title: "First Capsule Created",
    description: "Create your first time capsule",
    icon: Star,
    reward: "50 points",
    achievement_type: "first_capsule",
    points: 50,
    claimed: false,
  },
  {
    title: "Memory Keeper",
    description: "Store 10 memories in capsules",
    icon: Trophy,
    reward: "100 points",
    achievement_type: "memory_keeper",
    points: 100,
    progress: 0,
    maxProgress: 10,
    claimed: false,
  },
  {
    title: "Time Traveler",
    description: "Create capsules spanning 5 years total",
    icon: Clock,
    reward: "200 points",
    achievement_type: "time_traveler",
    points: 200,
    progress: 0,
    maxProgress: 5,
    claimed: false,
  },
  {
    title: "Sharing is Caring",
    description: "Share a capsule with 3 friends",
    icon: Gift,
    reward: "150 points",
    achievement_type: "sharing",
    points: 150,
    progress: 0,
    maxProgress: 3,
    claimed: false,
  },
];

export default function RewardsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [rewards, setRewards] = useState(defaultRewards);
  const [userStats, setUserStats] = useState({
    total_points: 0,
    capsules_created: 0,
    memories_stored: 0,
    days_preserved: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      } else if (statsData) {
        setUserStats(statsData);
      }

      // Update rewards with user progress
      if (achievementsData) {
        // Create a map of achievement types to their data
        const achievementMap = {};
        achievementsData.forEach(achievement => {
          achievementMap[achievement.achievement_type] = achievement;
        });

        // Update rewards with achievement data
        const updatedRewards = rewards.map(reward => {
          const userAchievement = achievementMap[reward.achievement_type];
          
          if (userAchievement) {
            // This achievement has been earned
            return {
              ...reward,
              claimed: true,
              progress: reward.maxProgress,
            };
          }
          
          // Calculate progress based on user stats
          let progress = 0;
          if (reward.achievement_type === 'first_capsule') {
            progress = statsData?.capsules_created > 0 ? 1 : 0;
          } else if (reward.achievement_type === 'memory_keeper') {
            progress = Math.min(statsData?.memories_stored || 0, reward.maxProgress);
          } else if (reward.achievement_type === 'time_traveler') {
            // Calculate years based on days preserved
            const yearsPreserved = Math.floor((statsData?.days_preserved || 0) / 365);
            progress = Math.min(yearsPreserved, reward.maxProgress);
          }
          
          return {
            ...reward,
            progress
          };
        });
        
        setRewards(updatedRewards);
      }
      
      setIsLoading(false);
    };

    fetchData();

    // Check for achievement completion when stats change
    const checkAchievements = async (stats) => {
      // First capsule created
      if (stats.capsules_created > 0) {
        const firstReward = rewards.find(r => r.achievement_type === 'first_capsule');
        if (firstReward && !firstReward.claimed) {
          await awardAchievement('first_capsule', firstReward);
        }
      }
      
      // Memory keeper (10 memories stored)
      if (stats.memories_stored >= 10) {
        const memoryReward = rewards.find(r => r.achievement_type === 'memory_keeper');
        if (memoryReward && !memoryReward.claimed) {
          await awardAchievement('memory_keeper', memoryReward);
        }
      }
      
      // Time traveler (5 years)
      const yearsPreserved = Math.floor(stats.days_preserved / 365);
      if (yearsPreserved >= 5) {
        const timeReward = rewards.find(r => r.achievement_type === 'time_traveler');
        if (timeReward && !timeReward.claimed) {
          await awardAchievement('time_traveler', timeReward);
        }
      }
    };

    // Subscribe to realtime updates for user stats
    const statsChannel = supabase
      .channel('schema-db-changes-rewards')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setUserStats(payload.new);
          checkAchievements(payload.new);
        }
      )
      .subscribe();

    // Subscribe to realtime updates for achievements
    const achievementsChannel = supabase
      .channel('schema-db-changes-achievements-rewards')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'achievements', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Update the reward with the matching achievement type
          setRewards(prevRewards => prevRewards.map(reward => 
            reward.achievement_type === payload.new.achievement_type
              ? { ...reward, claimed: true, progress: reward.maxProgress }
              : reward
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(achievementsChannel);
    };
  }, [user, rewards]);

  const awardAchievement = async (achievementType, reward) => {
    if (!user) return;
    
    try {
      // Insert the achievement
      const { error: achievementError } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievementType,
          achievement_name: reward.title,
          description: reward.description,
          points: reward.points
        });

      if (achievementError) {
        console.error('Error awarding achievement:', achievementError);
        return;
      }

      // Update user stats with the points
      const { error: statsError } = await supabase
        .from('user_stats')
        .update({ 
          total_points: userStats.total_points + reward.points,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (statsError) {
        console.error('Error updating user stats:', statsError);
      }
    } catch (e) {
      console.error('Error in achievement process:', e);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const levelProgress = (userStats.total_points / 1000) * 100;

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-16 sm:py-24 px-4 sm:px-6">
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
                <div className="flex flex-col items-center bg-muted/20 p-6 rounded-xl w-full md:w-auto">
                  <span className="text-4xl font-bold mb-2">{userStats.total_points}</span>
                  <span className="text-sm text-muted-foreground">Total Points</span>
                </div>
                
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Level Progress</span>
                    <span className="text-sm text-muted-foreground">{userStats.total_points}/1000 XP</span>
                  </div>
                  <Progress value={levelProgress} className="h-2 mb-4" />
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
                      <span>{reward.progress}/{reward.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(reward.progress / reward.maxProgress) * 100} 
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
      </div>
      <Footer />
    </>
  );
}
