
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const navigate = useNavigate();
  
  return (
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
  );
}
