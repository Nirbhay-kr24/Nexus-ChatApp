import { useRef, useState } from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const { theme } = useThemeStore(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const messageText = text.trim();
    const messageImage = imagePreview;

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      await sendMessage({
        text: messageText,
        image: messageImage,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(messageText);
      setImagePreview(messageImage);
    }
  };

  return (
    <div className="p-4 w-full" data-theme={theme}>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Emoji Picker Button */}
        <div className="relative flex items-center">
          <button
            type="button"
            className="btn btn-circle btn-sm mr-2"
            onClick={() => setShowEmojiPicker((v) => !v)}
            aria-label="Pick emoji"
          >
            <span role="img" aria-label="emoji">😊</span>
          </button>
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-16 z-50">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={theme === "dark" ? "dark" : "light"} 
              />
            </div>
          )}
        </div>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle bg-base-300 hover:bg-base-300/80
                     ${imagePreview ? "text-emerald-500" : "text-base-content"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
