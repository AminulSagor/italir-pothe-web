import {
    ArrowLeft,
    Bell,
    FileText,
    Mail,
    MessageSquare,
} from "lucide-react";

type RewardStatus = "notified" | "received" | "rewarded" | "digital";

interface RewardDetailHeaderProps {
    status: RewardStatus;
}

export default function RewardDetailHeader({ status }: RewardDetailHeaderProps) {
    const isRewarded = status === "rewarded" || status === "digital";

    return (
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
                <button className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-secondary">
                    <ArrowLeft className="size-5" />
                </button>

                <p className="text-sm font-bold uppercase tracking-wide text-black/55">
                    Gamification <span className="mx-2">›</span> Reward History{" "}
                    <span className="mx-2">›</span>
                    <span className="text-secondary">Reward Detail</span>
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/65">
                    <Bell className="size-5" />
                </button>

                <button className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/65">
                    <MessageSquare className="size-5" />
                </button>

                <button className="flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-8 text-sm font-bold uppercase text-white shadow-lg shadow-green-900/15">
                    {isRewarded ? (
                        <>
                            <FileText className="size-5" />
                            Download Invoice
                        </>
                    ) : (
                        <>
                            <Mail className="size-5" />
                            Resend Address Request
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}