
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

// Mock data for capsules
const mockCapsules = [
  {
    id: 1,
    title: "Graduation Memories",
    description: "Preserving the best moments from graduation day",
    creationDate: "2023-06-15",
    unlockDate: "2028-06-15",
    contentCount: 5,
    status: "active"
  },
  {
    id: 2,
    title: "Summer Vacation 2023",
    description: "Our amazing trip to the beach",
    creationDate: "2023-07-22",
    unlockDate: "2025-07-22",
    contentCount: 12,
    status: "active"
  }
];

export default function MyCapsulesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [capsules, setCapsules] = useState(mockCapsules);

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

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-24 px-4 sm:px-6">
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
                        {capsule.description}
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
                            Unlocks on {formatDate(capsule.unlockDate)}
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
                        {capsule.description}
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
                            Unlocks on {formatDate(capsule.unlockDate)}
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
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
