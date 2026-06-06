"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageSquare, Send, Users } from "lucide-react";

import type { WebinarChatMessageItem } from "@/types/webinar/webinar_type";

interface LiveAudienceChatProps {
  messages: WebinarChatMessageItem[];
  isLoading: boolean;
  isSending: boolean;
  onSendMessage: (message: string) => Promise<void> | void;
}

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export default function LiveAudienceChat({
  messages,
  isLoading,
  isSending,
  onSendMessage,
}: LiveAudienceChatProps) {
  const [messageText, setMessageText] = useState("");

  const activeText = useMemo(() => {
    if (messages.length === 0) return "No messages yet";
    return `${messages.length} messages`;
  }, [messages.length]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || isSending) return;
    await onSendMessage(text);
    setMessageText("");
  };

  return (
    <div className="rounded-[32px] bg-white p-7 shadow-sm">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#007A4D]">
          <MessageSquare className="size-5" />
          <h2 className="text-sm font-semibold">Live Audience Chat</h2>
        </div>

        <p className="text-xs text-[#4E5A52]">{activeText}</p>

        <Users className="size-5 text-[#202420]" />
      </div>

      <div className="min-h-[235px] max-h-[320px] space-y-4 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="rounded-3xl bg-[#F1F6EE] p-5 text-sm text-[#66736B]">
            Loading chat messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-3xl bg-[#F1F6EE] p-5 text-sm text-[#66736B]">
            No live chat messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 rounded-3xl p-3 ${
                message.isHost ? "border border-[#007A4D]/60 bg-[#F4FBF2]" : ""
              }`}
            >
              {message.senderProfilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={message.senderProfilePhoto}
                  alt={message.senderFullName}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D9E6D8] text-xs font-bold text-[#007A4D]">
                  {getInitials(message.senderFullName)}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#007A4D]">
                    {message.senderFullName || "Not available"}
                  </p>
                  {message.isHost ? (
                    <span className="rounded-full bg-[#E6F8E7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#007A4D]">
                      Host
                    </span>
                  ) : null}
                  <span className="text-[11px] text-[#9DA6A0]">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                <p className="mt-1 max-w-[520px] break-words text-sm leading-5 text-[#3F4642]">
                  {message.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex items-center gap-3 rounded-full bg-[#F1F6EE] px-6 py-4"
      >
        <input
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          placeholder="Type a message or use admin command..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#8B958E]"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={isSending || !messageText.trim()}
          className="text-[#007A4D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
}
