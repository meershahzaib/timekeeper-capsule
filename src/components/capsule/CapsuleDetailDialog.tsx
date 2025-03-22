
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Lock, Eye, Share2, Box, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CapsuleDetail {
  id: string;
  title: string;
  description: string;
  scheduled_open_date: string;
  created_at: string;
  is_private: boolean;
  status: 'active' | 'unlocked';
  contentCount: number;
  capsule_contents?: any[];
}

interface CapsuleDetailDialogProps {
  capsule: CapsuleDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CapsuleDetailDialog({ capsule, open, onOpenChange }: CapsuleDetailDialogProps) {
  if (!capsule) return null;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format creation date with time
  const formatCreationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl">{capsule.title}</DialogTitle>
            <div className={`px-2 py-1 rounded-full text-xs ${
              capsule.status === 'unlocked' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {capsule.status === 'unlocked' ? 'Unlocked' : 'Active'}
            </div>
          </div>
          <DialogDescription>
            {capsule.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1 p-3 bg-muted/20 rounded-lg">
              <span className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> Created
              </span>
              <span className="text-sm font-medium">{formatCreationDate(capsule.created_at)}</span>
            </div>
            
            <div className="flex flex-col space-y-1 p-3 bg-muted/20 rounded-lg">
              <span className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Unlocks
              </span>
              <span className="text-sm font-medium">{formatDate(capsule.scheduled_open_date)}</span>
            </div>
            
            <div className="flex flex-col space-y-1 p-3 bg-muted/20 rounded-lg">
              <span className="text-xs text-muted-foreground flex items-center">
                <Eye className="h-3 w-3 mr-1" /> Visibility
              </span>
              <span className="text-sm font-medium flex items-center">
                {capsule.is_private ? (
                  <><Lock className="h-3 w-3 mr-1" /> Private</>
                ) : (
                  <><Share2 className="h-3 w-3 mr-1" /> Shared</>
                )}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Box className="h-5 w-5 mr-2" /> 
              Contents ({capsule.contentCount})
            </h3>
            
            {capsule.capsule_contents && capsule.capsule_contents.length > 0 ? (
              <div className="space-y-3">
                {capsule.capsule_contents.map((content, index) => (
                  <Card key={index}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {content.content_type === 'text' 
                            ? (content.content_text || '').substring(0, 30) + '...' 
                            : content.content_url?.split('/').pop() || 'File'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {content.content_type.charAt(0).toUpperCase() + content.content_type.slice(1)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No contents found in this time capsule.
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {capsule.status === 'unlocked' && (
              <Button>
                Open Capsule
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
