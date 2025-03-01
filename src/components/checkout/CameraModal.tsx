
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, AlertCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CameraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setCameraPermissionDenied(false);
      
      // Stop any existing stream before starting a new one
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      setCameraPermissionDenied(true);
      
      // No toast here as it's handled by the error UI
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraPermissionDenied(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    // Restart the camera after setting capturedImage to null
    startCamera();
  };

  const confirmPhoto = () => {
    stopCamera();
    onSuccess();
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMode = () => {
    setUploadMode(!uploadMode);
    setCapturedImage(null);
    
    if (uploadMode) {
      // Switching from upload to camera mode
      startCamera();
    } else {
      // Switching from camera to upload mode
      stopCamera();
    }
  };

  useEffect(() => {
    if (open && !uploadMode) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open, uploadMode]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          stopCamera();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Cash Payment</DialogTitle>
          <DialogDescription>
            Please {uploadMode ? "upload" : "take"} a photo of the cash you'll use for payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative overflow-hidden rounded-lg border bg-muted">
          {cameraPermissionDenied && !uploadMode ? (
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-[300px]">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="font-medium text-lg">Camera access required</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  We need permission to use your camera to verify the cash payment.
                </p>
                <div className="space-y-3">
                  <p className="text-sm font-medium">How to enable camera access:</p>
                  <ol className="text-sm text-left list-decimal pl-5 space-y-1">
                    <li>Click the camera/lock icon in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={startCamera}
                  className="mt-2"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={toggleMode}
                  variant="outline"
                  className="mt-2"
                >
                  Upload Instead
                </Button>
              </div>
            </div>
          ) : uploadMode && !capturedImage ? (
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-6 h-[300px]">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-lg">Upload a photo</h3>
                <p className="text-muted-foreground mt-1">
                  Select an image of your cash payment from your device
                </p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex space-x-2">
                <Button onClick={triggerFileUpload}>
                  Choose File
                </Button>
                <Button 
                  onClick={toggleMode}
                  variant="outline"
                >
                  Use Camera Instead
                </Button>
              </div>
            </div>
          ) : !capturedImage && !uploadMode ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="h-[300px] w-full object-cover"
              />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <Button 
                  onClick={capturePhoto}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-12 w-12 bg-white/80 hover:bg-white shadow-md"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute top-3 right-3">
                <Button 
                  onClick={toggleMode}
                  variant="secondary"
                  size="sm"
                  className="bg-white/80 hover:bg-white shadow-md"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </>
          ) : (
            <div className="relative">
              <img 
                src={capturedImage!} 
                alt="Captured cash" 
                className="h-[300px] w-full object-contain"
              />
              <div className="absolute bottom-3 right-3">
                <Button 
                  onClick={uploadMode ? triggerFileUpload : retakePhoto}
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  {uploadMode ? "Choose Another" : "Retake"}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmPhoto}
            disabled={!capturedImage}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
