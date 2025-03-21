
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileText, Image, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  capsuleId: string;
  onUploadComplete: (fileUrl: string, fileType: string) => void;
}

export function TimeCapsuleUploader({ capsuleId, onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-6 w-6" />;
    if (fileType.startsWith("video/")) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const getFileType = (fileType: string) => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    if (fileType.startsWith("audio/")) return "audio";
    return "document";
  };

  const uploadFile = async () => {
    if (!file || !capsuleId) return;

    try {
      setUploading(true);
      setProgress(0);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${capsuleId}/${Date.now()}.${fileExt}`;
      const contentType = getFileType(file.type);
      
      // Create a storage bucket if it doesn't exist
      const { error: storageError } = await supabase
        .storage
        .from('capsule-contents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(percent);
          }
        });

      if (storageError) {
        throw storageError;
      }

      // Get the public URL
      const { data } = supabase
        .storage
        .from('capsule-contents')
        .getPublicUrl(filePath);

      // Add file reference to the database
      const { error: dbError } = await supabase
        .from('capsule_contents')
        .insert({
          capsule_id: capsuleId,
          content_type: contentType,
          content_url: data.publicUrl,
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Upload successful",
        description: `${file.name} has been added to your time capsule.`,
      });

      // Tell parent component about the new file
      onUploadComplete(data.publicUrl, contentType);
      
      // Reset state
      setFile(null);
      
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Label htmlFor="file-upload">Upload a file to your time capsule</Label>
          
          {!file && (
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Images, videos, documents, and more
                </span>
              </label>
            </div>
          )}

          {file && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getFileTypeIcon(file.type)}
                  <div className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploading && (
                <Progress value={progress} className="h-2 mb-2" />
              )}

              <div className="flex justify-end">
                <Button
                  onClick={uploadFile}
                  disabled={uploading}
                  className="mt-2"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
