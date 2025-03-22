
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AppearanceSettingsProps {
  onSave: () => void;
  isSaving: boolean;
}

export function AppearanceSettings({ onSave, isSaving }: AppearanceSettingsProps) {
  const { theme, setTheme, highContrast, setHighContrast, reducedMotion, setReducedMotion } = useTheme();
  
  const handleSaveAppearance = () => {
    toast.success("Appearance settings saved", {
      description: "Your preferences have been applied"
    });
    onSave();
  };
  
  return (
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
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-medium">Theme</h4>
          <Tabs 
            defaultValue={theme} 
            value={theme}
            className="w-full"
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">High Contrast</h4>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch 
              checked={highContrast} 
              onCheckedChange={setHighContrast}
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
              checked={reducedMotion} 
              onCheckedChange={setReducedMotion}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveAppearance} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
