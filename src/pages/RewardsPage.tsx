
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Medal, Trophy, Gift, Clock, Award, Star, Rocket, Target, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Reward, UserStats } from "@/types/rewards";
import { RewardsList } from "@/components/rewards/RewardsList";
import { WalletCard } from "@/components/rewards/WalletCard";
import { RewardLevels, getRewardMultiplier } from "@/components/rewards/RewardLevels";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Define default rewards
const defaultRewards: Reward[] = [
  {
    title: "First Capsule Created",
    description: "Create your first time capsule",
    icon: Star,
    reward: "50 points",
    achievement_type: "first_capsule",
    points: 50,
    claimed: false,
    claimable: false,
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
    claimable: false,
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
    claimable: false,
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
    claimable: false,
  },
  {
    title: "Consistent Creator",
    description: "Create a new capsule every day for 5 days",
    icon: Target,
    reward: "300 points",
    achievement_type: "consistent_creator",
    points: 300,
    progress: 0,
    maxProgress: 5,
    claimed: false,
    claimable: false,
  },
  {
    title: "Media Collector",
    description: "Add 15 images across all your capsules",
    icon: Award,
    reward: "250 points",
    achievement_type: "media_collector",
    points: 250,
    progress: 0,
    maxProgress: 15,
    claimed: false,
    claimable: false,
  },
  {
    title: "Long-term Planner",
    description: "Create a capsule with a 10+ year unlock date",
    icon: Rocket,
    reward: "500 points",
    achievement_type: "long_term_planner",
    points: 500,
    claimed: false,
    claimable: false,
  },
  {
    title: "Speed Capsule",
    description: "Create a capsule in under 2 minutes",
    icon: Zap,
    reward: "100 points",
    achievement_type: "speed_capsule",
    points: 100,
    claimed: false,
    claimable: false,
  },
];

export default function RewardsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [rewards, setRewards] = useState<Reward[]>(defaultRewards);
  const [userStats, setUserStats] = useState<UserStats>({
    total_points: 0,
    capsules_created: 0,
    memories_stored: 0,
    days_preserved: 0,
    accumulated_fil: 0,
    last_accumulation_time: new Date().toISOString()
  });
  const queryClient = useQueryClient();

  // Use React Query for data fetching to prevent infinite loading
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['rewards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) throw achievementsError;

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      } else if (statsData) {
        // If no last_accumulation_time, set it to now
        if (!statsData.last_accumulation_time) {
          const { data: updatedStats, error: updateError } = await supabase
            .from('user_stats')
            .update({ 
              last_accumulation_time: new Date().toISOString(),
              accumulated_fil: statsData.accumulated_fil || 0
            })
            .eq('user_id', user.id)
            .select('*')
            .single();
            
          if (!updateError && updatedStats) {
            setUserStats({
              total_points: updatedStats.total_points || 0,
              capsules_created: updatedStats.capsules_created || 0,
              memories_stored: updatedStats.memories_stored || 0,
              days_preserved: updatedStats.days_preserved || 0,
              accumulated_fil: updatedStats.accumulated_fil || 0,
              last_accumulation_time: updatedStats.last_accumulation_time
            });
          }
        } else {
          setUserStats({
            total_points: statsData.total_points || 0,
            capsules_created: statsData.capsules_created || 0,
            memories_stored: statsData.memories_stored || 0,
            days_preserved: statsData.days_preserved || 0,
            accumulated_fil: statsData.accumulated_fil || 0,
            last_accumulation_time: statsData.last_accumulation_time
          });
        }
      }

      // Fetch time capsules for additional progress calculations
      const { data: capsulesData, error: capsulesError } = await supabase
        .from('time_capsules')
        .select('*, capsule_contents(*)')
        .eq('user_id', user.id);
        
      if (capsulesError) console.error('Error fetching capsules:', capsulesError);

      // Update rewards with user progress
      const updatedRewards = defaultRewards.map(reward => {
        const userAchievement = achievementsData?.find(
          achievement => achievement.achievement_type === reward.achievement_type
        );
        
        if (userAchievement) {
          // This achievement has been earned
          return {
            ...reward,
            claimed: true,
            claimable: false,
            progress: reward.maxProgress || 1,
          };
        }
        
        // Calculate progress based on user stats and capsules
        let progress = 0;
        let claimable = false;
        
        if (reward.achievement_type === 'first_capsule') {
          progress = statsData?.capsules_created > 0 ? 1 : 0;
          claimable = progress === 1 && !userAchievement;
        } 
        else if (reward.achievement_type === 'memory_keeper') {
          progress = Math.min(statsData?.memories_stored || 0, reward.maxProgress || 10);
          claimable = progress >= (reward.maxProgress || 10) && !userAchievement;
        } 
        else if (reward.achievement_type === 'time_traveler') {
          // Calculate years based on days preserved
          const yearsPreserved = Math.floor((statsData?.days_preserved || 0) / 365);
          progress = Math.min(yearsPreserved, reward.maxProgress || 5);
          claimable = progress >= (reward.maxProgress || 5) && !userAchievement;
        } 
        else if (reward.achievement_type === 'sharing') {
          // Count capsules that are not private
          const sharedCapsules = capsulesData?.filter(c => c.is_private === false).length || 0;
          progress = Math.min(sharedCapsules, reward.maxProgress || 3);
          claimable = progress >= (reward.maxProgress || 3) && !userAchievement;
        }
        else if (reward.achievement_type === 'media_collector') {
          // Count image content across all capsules
          let imageCount = 0;
          capsulesData?.forEach(capsule => {
            imageCount += (capsule.capsule_contents || []).filter(
              content => content.content_type === 'image'
            ).length;
          });
          progress = Math.min(imageCount, reward.maxProgress || 15);
          claimable = progress >= (reward.maxProgress || 15) && !userAchievement;
        }
        else if (reward.achievement_type === 'long_term_planner') {
          // Check if any capsule has a 10+ year unlock date
          const now = new Date();
          const tenYearsLater = new Date(now.setFullYear(now.getFullYear() + 10));
          const hasLongTermCapsule = capsulesData?.some(
            capsule => new Date(capsule.scheduled_open_date) >= tenYearsLater
          );
          progress = hasLongTermCapsule ? 1 : 0;
          claimable = progress === 1 && !userAchievement;
        }
        
        return {
          ...reward,
          progress,
          claimable,
        };
      });
      
      setRewards(updatedRewards);
      
      return { achievementsData, statsData, capsulesData };
    },
    staleTime: 30000, // 30 seconds
    retry: 1,
    refetchInterval: 60000, // Refetch every minute to update achievements and Filecoin
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime updates for user stats
    const statsChannel = supabase
      .channel('schema-db-changes-rewards')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (!payload.new) return;
          
          setUserStats({
            total_points: payload.new.total_points || 0,
            capsules_created: payload.new.capsules_created || 0,
            memories_stored: payload.new.memories_stored || 0,
            days_preserved: payload.new.days_preserved || 0,
            accumulated_fil: payload.new.accumulated_fil || 0,
            last_accumulation_time: payload.new.last_accumulation_time
          });
          
          // Invalidate query to refetch data
          queryClient.invalidateQueries({ queryKey: ['rewards', user.id] });
        }
      )
      .subscribe();

    // Subscribe to realtime updates for achievements
    const achievementsChannel = supabase
      .channel('schema-db-changes-achievements-rewards')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'achievements', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (!payload.new) return;
          
          // Update the reward with the matching achievement type
          setRewards(prevRewards => prevRewards.map(reward => 
            reward.achievement_type === payload.new.achievement_type
              ? { ...reward, claimed: true, claimable: false, progress: reward.maxProgress || 1 }
              : reward
          ));
          
          // Invalidate query to refetch data
          queryClient.invalidateQueries({ queryKey: ['rewards', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(achievementsChannel);
    };
  }, [user, queryClient]);

  const claimReward = async (reward: Reward) => {
    if (!user || !reward.claimable || reward.claimed) return;
    
    try {
      // Insert the achievement
      const { error: achievementError } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: reward.achievement_type,
          achievement_name: reward.title,
          description: reward.description,
          points: reward.points,
          earned_at: new Date().toISOString()
        });

      if (achievementError) {
        console.error('Error awarding achievement:', achievementError);
        throw achievementError;
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
        throw statsError;
      }
      
      // Update local state immediately for better UX
      setRewards(prevRewards => 
        prevRewards.map(r => 
          r.achievement_type === reward.achievement_type
            ? { ...r, claimed: true, claimable: false }
            : r
        )
      );
      
      setUserStats(prev => ({
        ...prev,
        total_points: prev.total_points + reward.points
      }));
      
      return true;
    } catch (e) {
      console.error('Error in achievement process:', e);
      throw e;
    }
  };

  const accumulateFilecoin = useCallback(async () => {
    if (!user || !userStats.last_accumulation_time) return;
    
    const lastTime = new Date(userStats.last_accumulation_time).getTime();
    const currentTime = new Date().getTime();
    const hoursPassed = (currentTime - lastTime) / (1000 * 60 * 60);
    
    // Only update if at least 5 minutes have passed
    if (hoursPassed < 0.083) return; 
    
    const rewardMultiplier = getRewardMultiplier(userStats.total_points);
    const baseReward = 0.0002; // Base reward per 3 hours
    const hourlyRate = (baseReward / 3) * rewardMultiplier;
    const newAccumulation = hourlyRate * hoursPassed;
    
    const updatedTotal = (userStats.accumulated_fil || 0) + newAccumulation;
    
    try {
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          accumulated_fil: updatedTotal,
          last_accumulation_time: new Date().toISOString() 
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
    } catch (err) {
      console.error("Error updating accumulated FIL:", err);
    }
  }, [user, userStats]);

  // Periodically update accumulated FIL
  useEffect(() => {
    if (!user) return;
    
    // Initial update
    accumulateFilecoin();
    
    // Update every 5 minutes
    const interval = setInterval(accumulateFilecoin, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, accumulateFilecoin]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading rewards:", error);
    toast.error("There was an error loading your rewards. Please try again later.");
  }

  if (!user) return null;

  const rewardMultiplier = getRewardMultiplier(userStats.total_points);
  const levelProgress = (userStats.total_points / 5000) * 100;

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2">
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
                      <span className="text-sm text-muted-foreground">{userStats.total_points}/5000 XP</span>
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
          
          <div className="md:row-span-2">
            <WalletCard 
              rewardPoints={userStats.total_points} 
              userStats={userStats}
            />
          </div>
          
          <div className="md:col-span-2">
            <RewardLevels totalPoints={userStats.total_points} />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-6">Available Achievements</h2>
        <RewardsList 
          rewards={rewards} 
          onClaimReward={claimReward}
        />
      </div>
      <Footer />
    </>
  );
}
