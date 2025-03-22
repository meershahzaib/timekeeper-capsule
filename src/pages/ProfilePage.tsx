
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AccountInfo } from "@/components/profile/AccountInfo";
import { CapsuleStats } from "@/components/profile/CapsuleStats";
import { useQuery } from "@tanstack/react-query";

interface UserStats {
  capsules_created: number;
  memories_stored: number;
  days_preserved: number;
  total_points: number;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Use React Query to fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        return data as UserStats;
      } else {
        // Create user stats if they don't exist
        const defaultStats = {
          user_id: user.id,
          capsules_created: 0,
          memories_stored: 0,
          days_preserved: 0,
          total_points: 0
        };
        
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert(defaultStats);

        if (insertError) {
          throw insertError;
        }
        
        return defaultStats;
      }
    },
    enabled: !!user,
    retry: 1,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  // Subscribe to realtime updates when user is available
  useEffect(() => {
    if (!user) return;

    const userStatsChannel = supabase
      .channel('user-stats-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.new) {
            toast.success("Profile updated");
          }
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

  const defaultStats: UserStats = {
    capsules_created: 0,
    memories_stored: 0,
    days_preserved: 0,
    total_points: 0
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl py-16 sm:py-24 px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your profile information</p>
        </header>
        
        {statsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileHeader user={user} />
            </div>
            
            <div className="md:col-span-2">
              <AccountInfo user={user} />
              <CapsuleStats userStats={userStats || defaultStats} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
