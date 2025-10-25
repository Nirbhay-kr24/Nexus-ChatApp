import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, LogOut, Settings, Bell, Lock, Globe } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const handleMessageIndicator = ({ senderId }) => {
      
      if (!selectedUser || selectedUser._id !== senderId) {
        const updatedUsers = users.map(user => 
          user._id === senderId ? { ...user, hasUnread: true } : user
        );
        useChatStore.setState({ users: updatedUsers });
      }
    };

    socket.on("messageIndicatorUpdate", handleMessageIndicator);

    return () => {
      socket.off("messageIndicatorUpdate");
    };
  }, [users, selectedUser]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => user._id === "gemini-ai" || onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-64 lg:w-72 bg-slate-900 text-white flex flex-col transition-all duration-200">
      
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt="me"
            className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
          />
          <div className="min-w-0">
            <div className="font-semibold truncate">{authUser?.fullName || "Your name"}</div>
          </div>
        </div>
      </div>

     
      <nav className="p-4 border-b border-slate-800">
        <ul className="space-y-2">
          <li>
            <Link to="/settings" className="flex items-center gap-3 p-2 rounded hover:bg-slate-800">
              <Settings className="w-5 h-5 text-slate-300" />
              <span className="text-sm text-slate-200">General Settings</span>
            </Link>
          </li>
          
        </ul>
      </nav>

     
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">Contacts</div>
          <label className="cursor-pointer flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm bg-white/5"
            />
            <span className="text-xs text-slate-400">Online</span>
          </label>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const isGemini = user._id === "gemini-ai";
            const isOnline = isGemini || onlineUsers.includes(user._id);

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-2 flex items-center gap-3 rounded hover:bg-slate-800 transition-colors ${
                  selectedUser?._id === user._id ? "bg-slate-800" : ""
                }`}
              >
                <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0 text-left flex-1">
                  <div className="font-medium truncate flex items-center justify-between">
                    <span>{user.fullName}</span>
                    {user.hasUnread && (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ml-2 animate-pulse shadow-lg shadow-emerald-400/20" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{isOnline ? "Online" : "Offline"}</div>
                </div>
              </button>
            );
          })}

          {filteredUsers.length === 0 && <div className="text-center text-slate-500 py-4">No contacts</div>}
        </div>
      </div>

      
      <div className="p-4 border-t border-slate-800 mt-auto">
        <button
          className="btn btn-warning w-full"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;