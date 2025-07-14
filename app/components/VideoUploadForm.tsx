// Video upload form component
import { useState } from "react";
import { apiClient, VideoFormData } from "@/lib/api-client";
import { useNotification } from "./Notification";
import { useRouter } from "next/navigation";

interface VideoUploadFormProps {
  onSuccess: () => void;
}

const VideoUploadForm = ({ onSuccess }: VideoUploadFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [controls, setControls] = useState(true); // Default to true
  const { showNotification } = useNotification();
  const router = useRouter();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile) {
      showNotification("Please select a video file", "error");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("controls", controls ? "true" : "false");
    formData.append("videoFile", videoFile);

    try {
      // Use the correct method from your ApiClient, e.g., 'uploadVideo'.
      const response = await apiClient.uploadVideo(formData);
      showNotification("Video uploaded successfully", "success");
      onSuccess();
      if (response.data && response.data._id) {
        router.push(`/videos/${response.data._id}`);
      }
    } catch (error) {
      showNotification("Failed to upload video", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="videoFile">Video File</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label>Controls</label>
        <select
          value={controls ? "true" : "false"}
          onChange={(e) => setControls(e.target.value === "true")}
        >
          <option value="true">On</option>
          <option value="false">Off</option>
        </select>
      </div>
      <button type="submit" className="w-full">
        Upload Video
      </button>
    </form>
  );
};

export default VideoUploadForm;
