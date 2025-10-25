import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-base-content/60" />
              <div className="absolute inset-0 rounded-2xl border-2 border-base-300 animate-ping" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-base-content">Welcome to Nexus!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
