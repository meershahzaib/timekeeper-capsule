
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Time Capsules</h1>
      
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
