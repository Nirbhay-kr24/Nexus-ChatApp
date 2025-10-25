import { THEMES, THEME_CATEGORIES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsNameLoading(true);
    try {
      await updateProfile({ fullName: fullName.trim() });
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update name");
      console.error(error);
    } finally {
      setIsNameLoading(false);
    }
  };

  const handleUpdatePhoto = async (file) => {
    if (!file) return;

    setIsPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result;
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated!");
      } catch (error) {
        toast.error("Failed to update photo");
        console.error(error);
      } finally {
        setIsPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
        <div className="space-y-8">
         
          <div className="bg-base-200 p-6 rounded-xl flex flex-col gap-6">
            <h2 className="text-lg font-semibold">General Settings</h2>
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-base-300"
                />
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpdatePhoto(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("profilePic").click()}
                  className="btn btn-outline"
                  disabled={isPhotoLoading}
                >
                  {isPhotoLoading ? "Updating..." : "Change Photo"}
                </button>
              </div>

            
              <div className="flex-1">
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input input-bordered w-full"
                      placeholder="Your full name"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!fullName.trim() || isNameLoading}
                  >
                    {isNameLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>

         
          <div className="bg-base-200 p-6 rounded-xl space-y-6" style={{ minHeight: "362px" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-base-content/70">Customize your chat experience</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-300">
                <Sun className="w-4 h-4" />
                <div className="w-px h-4 bg-base-content/20"></div>
                <Moon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(THEME_CATEGORIES).map(([category, themes]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-base-300/50 rounded-lg">
                    {category === "Light" && <Sun className="w-4 h-4" />}
                    {category === "Dark" && <Moon className="w-4 h-4" />}
                    <h3 className="text-base font-medium">{category}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((t) => (
                      <button
                        key={t}
                        className={`group relative flex flex-col gap-3 p-4 rounded-xl transition-all duration-200
                          ${theme === t
                            ? "bg-base-100 ring-2 ring-primary shadow-lg scale-105 z-10"
                            : "hover:bg-base-100 hover:shadow-md hover:scale-102"
                          }`}
                        onClick={() => setTheme(t)}
                      >
                        <div
                          className="relative h-16 w-full rounded-lg overflow-hidden shadow-sm"
                          data-theme={t}
                        >
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2">
                            <div className="rounded-md bg-primary shadow-sm"></div>
                            <div className="rounded-md bg-secondary shadow-sm"></div>
                            <div className="rounded-md bg-accent shadow-sm"></div>
                            <div className="rounded-md bg-neutral shadow-sm"></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-sm font-medium text-center">
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </span>
                          {theme === t && (
                            <span className="block text-xs text-center text-primary">Active</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        <div
          className="space-y-4 flex flex-col"
          data-theme={theme} 
        >
          <h2 className="text-lg font-semibold">Chat Preview</h2>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg flex-1" style={{ minHeight: "362px" }}>
            <div className="p-4 bg-base-200 h-full flex flex-col">
              <div className="flex-1 max-w-full mx-auto">
                {/* Mock Chat UI */}
                <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                        J
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">John Doe</h3>
                        <p className="text-xs text-base-content/70">Online</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-base-100" style={{ minHeight: "324px" }}>
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl p-3 shadow-sm
                            ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-[10px] mt-1.5
                              ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}`}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-base-300 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default SettingsPage;
