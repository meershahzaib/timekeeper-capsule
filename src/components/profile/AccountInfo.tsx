
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar, User as UserIcon } from "lucide-react";

interface AccountInfoProps {
  user: User;
}

export function AccountInfo({ user }: AccountInfoProps) {
  // Format account creation date
  const createdAt = user.created_at ? new Date(user.created_at) : new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(createdAt);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your personal account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b">
          <UserIcon className="h-5 w-5 text-muted-foreground" />
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
  );
}
