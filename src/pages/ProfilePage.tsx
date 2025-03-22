
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Mail, Calendar, User, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userStats, setUserStats] = useState({
    capsules_created: 0,
    memories_stored: 0,
    days_preserved: 0,
    total_points: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  // Fetch user stats when profile loads
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (data) {
        setUserStats(data);
      } else {
        // Create user stats if they don't exist
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            capsules_created: 0,
            memories_stored: 0,
            days_preserved: 0,
            total_points: 0
          });

        if (insertError) {
          console.error('Error creating user stats:', insertError);
        }
      }
    };

    fetchUserStats();

    // Subscribe to realtime updates
    const userStatsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setUserStats(payload.new as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userStatsChannel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Format account creation date
  const createdAt = user.created_at ? new Date(user.created_at) : new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(createdAt);

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl py-16 sm:py-24 px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your profile information</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">
                    {(user.user_metadata?.username?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center">
                  {user.user_metadata?.username || "User"}
                </h2>
                <p className="text-muted-foreground text-center mb-4 text-sm break-all">{user.email}</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/settings")} 
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.user_metadata?.username || "Not set"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
