
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, LayoutDashboard, Box, Clock, LineChart, Plus, FileText, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [capsules, setCapsules] = useState([]);
  const [userStats, setUserStats] = useState({
    capsules_created: 0,
    memories_stored: 0,
    days_preserved: 0,
    total_points: 0
  });
  const [achievements, setAchievements] = useState([]);
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
      
      // Fetch user's capsules
      const { data: capsulesData, error: capsulesError } = await supabase
        .from('time_capsules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (capsulesError) {
        console.error('Error fetching capsules:', capsulesError);
      } else {
        setCapsules(capsulesData || []);
      }

      // Fetch or create user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) {
        if (statsError.code === 'PGRST116') {
          // Create user stats if they don't exist
          const { data: newStats, error: insertError } = await supabase
            .from('user_stats')
            .insert({
              user_id: user.id,
              capsules_created: 0,
              memories_stored: 0,
              days_preserved: 0,
              total_points: 0
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user stats:', insertError);
          } else if (newStats) {
            setUserStats(newStats);
          }
        } else {
          console.error('Error fetching user stats:', statsError);
        }
      } else if (statsData) {
        setUserStats(statsData);
      }

      // Fetch recent achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(3);

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
      } else {
        setAchievements(achievementsData || []);
      }

      setIsLoading(false);
    };

    fetchData();

    // Subscribe to realtime updates
    const capsulesChannel = supabase
      .channel('schema-db-changes-capsules')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'time_capsules', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCapsules(prevCapsules => [payload.new, ...prevCapsules]);
          }
        }
      )
      .subscribe();

    const statsChannel = supabase
      .channel('schema-db-changes-stats')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setUserStats(payload.new);
        }
      )
      .subscribe();

    const achievementsChannel = supabase
      .channel('schema-db-changes-achievements')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'achievements', filter: `user_id=eq.${user.id}` },
        (payload) => {
          // Show toast for new achievement
          toast.success(`Achievement unlocked: ${payload.new.achievement_name}`, {
            description: `+${payload.new.points} points`
          });
          
          setAchievements(prevAchievements => 
            [payload.new, ...prevAchievements].slice(0, 3)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(capsulesChannel);
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(achievementsChannel);
    };
  }, [user]);

  const handleCreateCapsule = () => {
    navigate("/create-capsule");
  };

  if (loading || isLoading) {
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
      <div className="container max-w-6xl py-16 sm:py-24 px-4 sm:px-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.user_metadata?.username || "User"}
            </p>
          </div>
          <Button onClick={handleCreateCapsule} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Capsule
          </Button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Box className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">{userStats.capsules_created}</h3>
              <p className="text-sm text-muted-foreground">Active Capsules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Clock className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">{userStats.days_preserved}</h3>
              <p className="text-sm text-muted-foreground">Days Preserved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">{userStats.memories_stored}</h3>
              <p className="text-sm text-muted-foreground">Media Items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Award className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">{userStats.total_points}</h3>
              <p className="text-sm text-muted-foreground">Reward Points</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest time capsule interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {capsules.length > 0 ? (
                <div className="space-y-4">
                  {capsules.slice(0, 3).map((capsule: any) => (
                    <div key={capsule.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Box className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{capsule.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(capsule.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/my-capsules`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                  
                  <div className="pt-2 text-center">
                    <Button 
                      variant="link" 
                      onClick={() => navigate("/my-capsules")}
                    >
                      View all capsules
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Box className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No recent activity</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You haven't created any time capsules yet. Start preserving your memories today!
                  </p>
                  <Button onClick={handleCreateCapsule}>Create Your First Capsule</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleCreateCapsule}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Capsule
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/my-capsules")}>
                <Box className="mr-2 h-4 w-4" />
                View My Capsules
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/rewards")}>
                <Award className="mr-2 h-4 w-4" />
                View Achievements
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/settings")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
