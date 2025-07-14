"use client"; // This component must be a client component

import { upload } from "@imagekit/next";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: unknown) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   validations
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
    }
    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !validateFile(file)) {
      return;
    }
    setIsUploading(true);
    setError(null);

    try {
      const authResponse = await fetch("/api/imagekit-auth");
      const auth = await authResponse.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        token: auth.token,
        expire: auth.expire,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        },
      });
      onSuccess(res);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <input
        type="file"
        accept={fileType === "image" ? "image/*" : "video/*"}
        onChange={handleFileChange}
      >
        {isUploading && (
          <div className="flex items-center gap-2 text-md text-primary">
            <Loader2 className="animate-spin" />
            <span>Uploading...</span>
          </div>
        )}
      </input>
    </>
  );
};

export default FileUpload;
