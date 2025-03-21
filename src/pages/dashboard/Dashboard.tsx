
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Box, Clock, LineChart, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

export default function Dashboard() {
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

  const handleCreateCapsule = () => {
    navigate("/create-capsule");
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-24 px-4 sm:px-6">
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
              <h3 className="text-2xl font-semibold mb-1">0</h3>
              <p className="text-sm text-muted-foreground">Active Capsules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Clock className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">0</h3>
              <p className="text-sm text-muted-foreground">Days Preserved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <LayoutDashboard className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">0</h3>
              <p className="text-sm text-muted-foreground">Media Items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <LineChart className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-2xl font-semibold mb-1">0</h3>
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
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Box className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No recent activity</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  You haven't created any time capsules yet. Start preserving your memories today!
                </p>
                <Button onClick={handleCreateCapsule}>Create Your First Capsule</Button>
              </div>
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
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Update Profile
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
