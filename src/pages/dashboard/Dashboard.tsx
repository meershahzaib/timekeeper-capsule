
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
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
    <div className="container max-w-6xl py-24 px-4 sm:px-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Time Capsules</h1>
          <p className="text-muted-foreground mt-1">Preserve memories for your future self</p>
        </div>
        <Button 
          onClick={() => navigate("/create-capsule")}
          className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Capsule
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Create New Capsule</CardTitle>
            <CardDescription>Start preserving your memories</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="w-full" onClick={() => navigate("/create-capsule")}>
              Create Capsule
            </Button>
          </CardContent>
        </Card>
        
        {/* This empty card will be replaced with actual capsules when we implement that feature */}
        <Card className="border border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">No Capsules Yet</CardTitle>
            <CardDescription>Your capsules will appear here</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
