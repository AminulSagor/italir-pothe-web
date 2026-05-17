import { RefreshCcw } from "lucide-react";

export default function RewardHistoryCard() {
    return (
        <section className="mx-auto max-w-[780px] rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="text-center text-xl font-light uppercase tracking-wide text-black/65">
                Reward History
            </h2>

            <button className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-secondary text-lg font-medium text-white shadow-lg shadow-green-900/20 hover:cursor-pointer">
                <RefreshCcw className="size-5" />
                Go to Reward History Page
            </button>
        </section>
    );
}