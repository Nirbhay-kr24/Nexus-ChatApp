import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import ReactMarkdown from "react-markdown";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto" data-theme={theme}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto" data-theme={theme}>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === authUser._id;
          const isGeminiMessage = message.senderId === "gemini-ai";

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : isGeminiMessage
                        ? "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble flex flex-col ${
                  isGeminiMessage
                    ? "bg-blue-500 text-white" // Gemini messages 
                    : isOwnMessage
                    ? "bg-black text-white"   // Sender messages 
                    : "bg-gray-200 text-black"  // Receiver messages 
                } ${message.isPlaceholder ? "opacity-95 italic" : ""}`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && (
                  isGeminiMessage ? (
                    message.isPlaceholder ? (
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse inline-block" />
                        <span className="italic">Thinking...</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-invert text-white">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="mb-2 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />
                            ),
                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                            h1: ({ node, ...props }) => (
                              <h1 className="text-xl font-bold mb-2 mt-3" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 className="text-lg font-bold mb-2 mt-3" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-base font-bold mb-2 mt-2" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded text-sm" {...props} />
                              ) : (
                                <code className="block bg-white bg-opacity-20 p-3 rounded my-2 overflow-x-auto" {...props} />
                              ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="border-l-4 border-white pl-3 italic my-2" {...props} />
                            ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    )
                  ) : (
                    <p>{message.text}</p>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
