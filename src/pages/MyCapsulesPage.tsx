
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Clock, Lock, Box, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { CapsuleDetailDialog } from "@/components/capsule/CapsuleDetailDialog";
import { useQuery } from "@tanstack/react-query";

type Capsule = {
  id: string;
  title: string;
  description: string;
  scheduled_open_date: string;
  is_private: boolean;
  created_at: string;
  status: 'active' | 'unlocked';
  contentCount: number;
  capsule_contents?: any[];
};

export default function MyCapsulesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use React Query to prevent infinite loading issues
  const { isLoading, error } = useQuery({
    queryKey: ['capsules', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('time_capsules')
        .select('*, capsule_contents(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add a status property based on the scheduled_open_date
      const processedCapsules = data.map(capsule => ({
        ...capsule,
        status: new Date(capsule.scheduled_open_date) <= new Date() ? 'unlocked' : 'active',
        contentCount: capsule.capsule_contents ? capsule.capsule_contents.length : 0
      })) as Capsule[];
      
      setCapsules(processedCapsules);
      return processedCapsules;
    },
    staleTime: 30000, // 30 seconds
    retry: 1
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      toast.error("You must be signed in to view this page");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime updates for capsules
    const capsulesChannel = supabase
      .channel('schema-db-changes-mycapsules')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'time_capsules', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the full capsule with contents
            supabase
              .from('time_capsules')
              .select('*, capsule_contents(*)')
              .eq('id', payload.new.id)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  const newCapsule = {
                    ...data,
                    status: new Date(data.scheduled_open_date) <= new Date() ? 'unlocked' : 'active',
                    contentCount: data.capsule_contents ? data.capsule_contents.length : 0
                  } as Capsule;
                  
                  setCapsules(prevCapsules => [newCapsule, ...prevCapsules]);
                }
              });
          } else if (payload.eventType === 'UPDATE') {
            setCapsules(prevCapsules => prevCapsules.map(capsule => 
              capsule.id === payload.new.id 
                ? { 
                    ...capsule, 
                    ...payload.new,
                    status: new Date(payload.new.scheduled_open_date) <= new Date() ? 'unlocked' : 'active'
                  } 
                : capsule
            ));
          } else if (payload.eventType === 'DELETE') {
            setCapsules(prevCapsules => prevCapsules.filter(capsule => capsule.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Also subscribe to changes in capsule contents
    const contentsChannel = supabase
      .channel('schema-db-changes-contents')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'capsule_contents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCapsules(prevCapsules => prevCapsules.map(capsule => 
              capsule.id === payload.new.capsule_id 
                ? { ...capsule, contentCount: (capsule.contentCount || 0) + 1 } 
                : capsule
            ));
          } else if (payload.eventType === 'DELETE') {
            setCapsules(prevCapsules => prevCapsules.map(capsule => 
              capsule.id === payload.old.capsule_id 
                ? { ...capsule, contentCount: Math.max((capsule.contentCount || 0) - 1, 0) } 
                : capsule
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(capsulesChannel);
      supabase.removeChannel(contentsChannel);
    };
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading capsules:", error);
    toast.error("There was an error loading your capsules. Please try again later.");
  }

  if (!user) return null;

  const filteredCapsules = activeTab === "all" 
    ? capsules 
    : capsules.filter(capsule => capsule.status === activeTab);

  const handleCreateCapsule = () => {
    navigate("/create-capsule");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (capsule: Capsule) => {
    setSelectedCapsule(capsule);
    setDialogOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-16 sm:py-24 px-4 sm:px-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Time Capsules</h1>
            <p className="text-muted-foreground mt-1">View and manage your time capsules</p>
          </div>
          <Button onClick={handleCreateCapsule} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Capsule
          </Button>
        </header>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Capsules</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center">
              <Button variant="outline" size="sm" className="ml-auto flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {filteredCapsules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCapsules.map((capsule) => (
                  <Card key={capsule.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/20 pb-4">
                      <CardTitle className="flex justify-between items-start">
                        <span>{capsule.title}</span>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {capsule.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{capsule.contentCount} items stored</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {capsule.status === 'unlocked' 
                              ? `Unlocked on ${formatDate(capsule.scheduled_open_date)}` 
                              : `Unlocks on ${formatDate(capsule.scheduled_open_date)}`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 px-6 py-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(capsule)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 flex flex-col items-center text-center">
                  <Box className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No capsules found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You haven't created any time capsules yet. Start preserving your memories today!
                  </p>
                  <Button onClick={handleCreateCapsule}>Create Your First Capsule</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            {filteredCapsules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCapsules.map((capsule) => (
                  <Card key={capsule.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/20 pb-4">
                      <CardTitle className="flex justify-between items-start">
                        <span>{capsule.title}</span>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {capsule.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{capsule.contentCount} items stored</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Unlocks on {formatDate(capsule.scheduled_open_date)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 px-6 py-4">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 flex flex-col items-center text-center">
                  <Box className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No active capsules</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You don't have any active time capsules. Create one to start your journey!
                  </p>
                  <Button onClick={handleCreateCapsule}>Create New Capsule</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="unlocked" className="mt-0">
            {filteredCapsules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCapsules.map((capsule) => (
                  <Card key={capsule.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/20 pb-4">
                      <CardTitle className="flex justify-between items-start">
                        <span>{capsule.title}</span>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {capsule.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{capsule.contentCount} items stored</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Unlocked on {formatDate(capsule.scheduled_open_date)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 px-6 py-4">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 flex flex-col items-center text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No unlocked capsules</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    You don't have any unlocked time capsules yet. They will appear here once their scheduled unlock date arrives.
                  </p>
                  <Button onClick={handleCreateCapsule} variant="outline">Create New Capsule</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <CapsuleDetailDialog 
          capsule={selectedCapsule}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
      <Footer />
    </>
  );
}
