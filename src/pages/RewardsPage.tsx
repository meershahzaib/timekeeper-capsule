
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Gift } from "lucide-react";

export default function RewardsPage() {
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Rewards</h1>
        <p className="text-muted-foreground mt-1">Earn rewards for using Time Capsule</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>Exciting rewards program under development</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our rewards program is currently under development. Stay tuned for exciting perks and benefits!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
