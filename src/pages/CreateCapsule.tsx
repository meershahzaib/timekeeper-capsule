
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TimeCapsuleUploader } from "@/components/capsule/TimeCapsuleUploader";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, FileText, Image as ImageIcon, Video } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }).max(100),
  description: z.string().max(500, { message: "Description cannot exceed 500 characters" }).optional(),
  openDate: z.date().min(new Date(), { message: "Open date must be in the future" }),
  isPrivate: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCapsule() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [contentFiles, setContentFiles] = useState<{ url: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      openDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      isPrivate: true,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      toast.error("You must be signed in to create a time capsule");
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("Please sign in to create a time capsule");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate days preserved (for achievements)
      const currentDate = new Date();
      const openDate = values.openDate;
      const daysPreserved = Math.ceil((openDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      // Create the capsule
      const { data, error } = await supabase
        .from('time_capsules')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description || null,
          scheduled_open_date: values.openDate.toISOString(),
          is_private: values.isPrivate,
        })
        .select('id')
        .single();

      if (error) throw error;
      
      setCapsuleId(data.id);
      setActiveTab("content");
      
      // Update user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) {
        if (statsError.code === 'PGRST116') {
          // Create new stats if they don't exist
          await supabase
            .from('user_stats')
            .insert({
              user_id: user.id,
              capsules_created: 1,
              days_preserved: daysPreserved,
              memories_stored: 0,
              total_points: 0
            });
        } else {
          console.error('Error fetching user stats:', statsError);
        }
      } else {
        // Update existing stats
        await supabase
          .from('user_stats')
          .update({
            capsules_created: statsData.capsules_created + 1,
            days_preserved: statsData.days_preserved + daysPreserved,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
      
      toast.success("Time capsule created", {
        description: "Now you can add memories to your capsule"
      });
    } catch (error: any) {
      console.error("Error creating time capsule:", error);
      toast.error("Failed to create time capsule", {
        description: error.message || "Please try again"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = async (fileUrl: string, fileType: string) => {
    if (!capsuleId || !user) return;

    setContentFiles([...contentFiles, { url: fileUrl, type: fileType }]);

    try {
      // Update user stats for memories stored
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('memories_stored')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      } else if (statsData) {
        await supabase
          .from('user_stats')
          .update({
            memories_stored: statsData.memories_stored + 1,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  const handleFinish = () => {
    toast.success("Time capsule saved", {
      description: "Your memories are now preserved for the future!"
    });
    navigate("/dashboard");
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-3xl py-16 sm:py-20 px-4">
        <h1 className="text-3xl font-bold mb-8">Create a New Time Capsule</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content" disabled={!capsuleId}>Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Time Capsule Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="My Time Capsule" {...field} />
                          </FormControl>
                          <FormDescription>
                            Give your time capsule a meaningful name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What's inside this time capsule? Why are you creating it?" 
                              className="resize-none" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Add context about this time capsule for your future self.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="openDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Open Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When would you like this time capsule to be available to open?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Private Capsule</FormLabel>
                            <FormDescription>
                              Only you will be able to view this time capsule when it's opened.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        "Create Time Capsule"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Content</CardTitle>
              </CardHeader>
              <CardContent>
                {capsuleId && (
                  <TimeCapsuleUploader 
                    capsuleId={capsuleId} 
                    onUploadComplete={handleUploadComplete} 
                  />
                )}
                
                {contentFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Added Content ({contentFiles.length})</h3>
                    <ul className="space-y-2">
                      {contentFiles.map((file, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          {file.type === 'image' && <ImageIcon className="h-4 w-4" />}
                          {file.type === 'video' && <Video className="h-4 w-4" />}
                          {file.type === 'document' && <FileText className="h-4 w-4" />}
                          <span className="truncate">{new URL(file.url).pathname.split('/').pop()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Separator className="my-6" />
                
                <div className="flex justify-end">
                  <Button onClick={handleFinish} disabled={contentFiles.length === 0}>
                    Finish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
