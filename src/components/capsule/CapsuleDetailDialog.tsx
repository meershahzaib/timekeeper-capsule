
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Lock, Unlock, Calendar, Box, Share2, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

type CapsuleContent = {
  id: string;
  content_type: string;
  content_text: string | null;
  content_url: string | null;
  created_at: string;
};

type Capsule = {
  id: string;
  title: string;
  description: string;
  scheduled_open_date: string;
  is_private: boolean;
  created_at: string;
  status: 'active' | 'unlocked';
  contentCount: number;
  capsule_contents?: CapsuleContent[];
};

interface CapsuleDetailDialogProps {
  capsule: Capsule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CapsuleDetailDialog({ capsule, open, onOpenChange }: CapsuleDetailDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<CapsuleContent[]>([]);

  React.useEffect(() => {
    if (open && capsule) {
      const loadContents = async () => {
        setIsLoading(true);
        
        try {
          const { data, error } = await supabase
            .from('capsule_contents')
            .select('*')
            .eq('capsule_id', capsule.id);
            
          if (error) {
            console.error("Error loading capsule contents:", error);
            toast.error("Failed to load capsule contents");
          } else {
            setContents(data || []);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          toast.error("An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadContents();
    }
  }, [open, capsule]);

  if (!capsule) return null;

  const handleDeleteCapsule = async () => {
    if (!user || !capsule) return;
    
    if (!confirm("Are you sure you want to delete this time capsule? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First delete all contents
      const { error: contentsError } = await supabase
        .from('capsule_contents')
        .delete()
        .eq('capsule_id', capsule.id);
        
      if (contentsError) throw contentsError;
      
      // Then delete the capsule
      const { error: capsuleError } = await supabase
        .from('time_capsules')
        .delete()
        .eq('id', capsule.id)
        .eq('user_id', user.id);
        
      if (capsuleError) throw capsuleError;
      
      toast.success("Time capsule deleted successfully");
      onOpenChange(false);
    } catch (err) {
      console.error("Error deleting capsule:", err);
      toast.error("Failed to delete time capsule");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };
  
  const isUnlocked = new Date(capsule.scheduled_open_date) <= new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isUnlocked ? (
              <Unlock className="h-5 w-5 text-primary" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
            {capsule.title}
          </DialogTitle>
          <DialogDescription>
            {capsule.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Created on {formatDate(capsule.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {isUnlocked 
                ? `Unlocked on ${formatDate(capsule.scheduled_open_date)}` 
                : `Unlocks on ${formatDate(capsule.scheduled_open_date)}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{contents.length} items stored</span>
          </div>
          
          <div className="flex items-center gap-2">
            {capsule.is_private ? (
              <>
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Private capsule</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Shared capsule</span>
              </>
            )}
          </div>
        </div>

        <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
          <h3 className="font-medium mb-3">Capsule Contents</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : contents.length > 0 ? (
            <div className="space-y-3">
              {contents.map((content) => (
                <div key={content.id} className="border p-3 rounded-md bg-muted/20">
                  {content.content_type === 'text' && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Text Message</div>
                      <p className="text-sm">{content.content_text}</p>
                    </div>
                  )}
                  {content.content_type === 'image' && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Image</div>
                      {content.content_url && (
                        <img 
                          src={content.content_url} 
                          alt="Capsule image" 
                          className="rounded-md max-h-60 object-contain"
                        />
                      )}
                    </div>
                  )}
                  {content.content_type === 'link' && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Link</div>
                      {content.content_url && (
                        <a 
                          href={content.content_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >
                          {content.content_url}
                        </a>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Added {formatDate(content.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No content found in this capsule.
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button 
            variant="destructive" 
            onClick={handleDeleteCapsule}
            disabled={isLoading}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Capsule
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
