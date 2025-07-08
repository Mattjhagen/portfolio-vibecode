import { useState, useRef } from "react";
import { Upload, FileText, File, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UploadZoneProps {
  onUploadComplete: (portfolioData: any) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Upload file
      const formData = new FormData();
      formData.append('resume', file);

      const uploadResponse = await apiRequest('POST', '/api/upload-resume', formData);
      const uploadResult = await uploadResponse.json();

      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setIsProcessing(true);

      // Generate portfolio
      const portfolioResponse = await apiRequest('POST', '/api/generate-portfolio', {
        fileId: uploadResult.fileId
      });
      const portfolioResult = await portfolioResponse.json();

      setIsProcessing(false);
      onUploadComplete(portfolioResult.portfolio);

      toast({
        title: "Portfolio generated successfully!",
        description: `Your portfolio is now live at ${portfolioResult.portfolio.url}`,
      });

    } catch (error) {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className={`glass-effect p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragOver ? 'border-vibe-green bg-vibe-green/10' : 'border-white/20 hover:border-vibe-pink hover:bg-vibe-pink/10'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mb-6">
        <Upload className="text-vibe-pink text-6xl mx-auto mb-4" size={64} />
        <h3 className="text-2xl font-semibold mb-2">Upload Your Resume</h3>
        <p className="text-gray-400">Drag & drop your resume or click to browse</p>
        <p className="text-sm text-gray-500 mt-2">Supports PDF, DOCX, TXT • Max 10MB</p>
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FileText className="text-red-400" size={16} />
          <span>PDF</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <File className="text-blue-400" size={16} />
          <span>DOCX</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FileText className="text-gray-400" size={16} />
          <span>TXT</span>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm text-gray-300">Uploading...</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="text-vibe-green ai-pulse" size={24} />
            <span className="text-sm text-gray-300">AI is analyzing your resume...</span>
          </div>
          <div className="text-xs text-gray-400">
            This may take 30-60 seconds
          </div>
        </div>
      )}

      {!isUploading && !isProcessing && (
        <Button 
          className="bg-vibe-pink hover:bg-vibe-pink/80 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          onClick={handleClick}
        >
          Generate My Portfolio
        </Button>
      )}
    </Card>
  );
}
