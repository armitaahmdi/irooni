"use client";

import { useState } from "react";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

/**
 * MediaButtons Component
 * Image, video, and YouTube buttons
 */
export default function MediaButtons({ editor }) {
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!editor) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "خطا در آپلود عکس");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("خطا در آپلود عکس");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<video controls src="${data.url}" style="max-width: 100%; height: auto;"></video>`
          )
          .run();
      } else {
        alert(data.error || "خطا در آپلود ویدیو");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("خطا در آپلود ویدیو");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleYouTubeLink = () => {
    const url = window.prompt("لینک YouTube را وارد کنید:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <ToolbarGroup>
      <div className="relative">
        <input
          type="file"
          id="image-upload-input"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="image-upload-input"
          className={`cursor-pointer p-2 rounded hover:bg-gray-200 inline-block ${
            uploadingImage ? "opacity-50 cursor-wait" : ""
          }`}
          title="افزودن تصویر از سیستم"
        >
          {uploadingImage ? "⏳" : "🖼️"}
        </label>
      </div>

      <div className="relative">
        <input
          type="file"
          id="video-upload-input"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
        />
        <label
          htmlFor="video-upload-input"
          className={`cursor-pointer p-2 rounded hover:bg-gray-200 inline-block ${
            uploadingImage ? "opacity-50 cursor-wait" : ""
          }`}
          title="افزودن ویدیو از سیستم"
        >
          {uploadingImage ? "⏳" : "🎥"}
        </label>
      </div>

      <ToolbarButton onClick={handleYouTubeLink} title="افزودن ویدیو YouTube">
        ▶️
      </ToolbarButton>
    </ToolbarGroup>
  );
}

