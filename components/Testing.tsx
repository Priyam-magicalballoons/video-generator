"use client";

import React, { useState } from "react";
import { toast } from "sonner";

const VideoOverlayUploader = () => {
  const [video, setVideo] = useState(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);

  // Handle file input change
  const handleFileChange = (e:any) => {
    setVideo(e.target.files[0]);
  };

  // Handle text input change
  const handleTextChange = (e:any) => {
    setText(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!video) {
      toast("Please select a video file.")
      return;
    }
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("text", text);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });


      if (!response.ok) throw new Error("Failed to process video");

      // Download the processed video
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error:any) {
      toast(error.message || "Error processing video");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Overlay Text on Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Select Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Overlay Text</label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="block w-full border px-2 py-1 rounded"
            placeholder="Enter overlay text"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={processing}
        >
          {processing ? "Processing..." : "Upload & Overlay"}
        </button>
      </form>
    </div>
  );
};

export default VideoOverlayUploader;
