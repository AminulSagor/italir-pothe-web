import { CircleX, Send } from "lucide-react";

export default function FulfillmentActionsCard() {
    return (
        <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black/45">
                Fulfillment Actions
            </h2>

            <div className="mt-6 space-y-4">
                <button className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#E6F6E2] text-sm font-bold uppercase text-secondary">
                    <Send className="size-5" />
                    Send Update Notification
                </button>

                <button className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#F8F4F3] text-sm font-bold uppercase text-[#D22B2B]">
                    <CircleX className="size-5" />
                    Revoke Reward
                </button>
            </div>
        </aside>
    );
}