import { MessageSquare, Send, Users } from "lucide-react";

const messages = [
  {
    name: "Marco Polo",
    time: "15:40",
    text: "Can you explain the use of 'Congiuntivo' in this sentence again? Grazie!",
  },
  {
    name: "Elena Rossi",
    time: "15:41",
    text: "This is so helpful! The audio quality is great today.",
  },
];

export default function LiveAudienceChat() {
  return (
    <div className="rounded-[32px] bg-white p-7 shadow-sm">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#007A4D]">
          <MessageSquare className="size-5" />
          <h2 className="text-sm font-semibold">Live Audience Chat</h2>
        </div>

        <p className="text-xs text-[#4E5A52]">Active now</p>

        <Users className="size-5 text-[#202420]" />
      </div>

      <div className="min-h-[235px] space-y-7">
        {messages.map((message) => (
          <div key={message.name} className="flex gap-3">
            <div className="size-10 rounded-full bg-[#D9E6D8]" />

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#007A4D]">
                  {message.name}
                </p>
                <span className="text-[11px] text-[#9DA6A0]">
                  {message.time}
                </span>
              </div>
              <p className="mt-1 max-w-[520px] text-sm leading-5 text-[#3F4642]">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-full bg-[#F1F6EE] px-6 py-4">
        <input
          placeholder="Type a message or use admin command..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#8B958E]"
        />
        <Send className="size-5 text-[#007A4D]" />
      </div>
    </div>
  );
}
