
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { Loader2, Shield, Bell, Eye, Moon, User, Mail } from "lucide-react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      marketing: false,
      socialUpdates: true,
      securityAlerts: true
    },
    appearance: {
      darkMode: false,
      highContrast: false,
      reducedMotion: false
    },
    privacy: {
      publicProfile: true,
      showActivity: true
    }
  });

  // Redirect if not authenticated
  if (!loading && !user) {
    navigate("/");
    return null;
  }

  const handleToggleSetting = (category: keyof typeof settings, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting as keyof typeof settings[typeof category]]
      }
    });
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated"
      });
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "There was an error saving your preferences"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl py-24 px-4 sm:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        defaultValue={user?.user_metadata?.username || ""} 
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        defaultValue={user?.email || ""} 
                        placeholder="Your email" 
                        type="email"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Contact support to change your email
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your capsules
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.email} 
                        onCheckedChange={() => handleToggleSetting('notifications', 'email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive occasional updates about new features
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.marketing} 
                        onCheckedChange={() => handleToggleSetting('notifications', 'marketing')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Social Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Notifications when friends create capsules
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.socialUpdates} 
                        onCheckedChange={() => handleToggleSetting('notifications', 'socialUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Important security-related notifications
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.securityAlerts} 
                        onCheckedChange={() => handleToggleSetting('notifications', 'securityAlerts')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how TimeSeal looks for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Switch to a darker color scheme
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.darkMode} 
                        onCheckedChange={() => handleToggleSetting('appearance', 'darkMode')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">High Contrast</h4>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.highContrast} 
                        onCheckedChange={() => handleToggleSetting('appearance', 'highContrast')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Reduced Motion</h4>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations throughout the application
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.reducedMotion} 
                        onCheckedChange={() => handleToggleSetting('appearance', 'reducedMotion')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Public Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your profile information
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.publicProfile} 
                        onCheckedChange={() => handleToggleSetting('privacy', 'publicProfile')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Activity Visibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Show when you're active and creating capsules
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showActivity} 
                        onCheckedChange={() => handleToggleSetting('privacy', 'showActivity')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
