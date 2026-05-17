import { ImageIcon, Info, Lock, Search } from "lucide-react";

export default function VisualEvidenceCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-sky-50 text-secondary">
                        <ImageIcon className="size-5" />
                    </span>

                    <h2 className="text-lg font-bold text-black/90">Visual Evidence</h2>
                </div>

                <span className="hidden items-center gap-2 rounded-full bg-[#EEF3EC] px-4 py-2 text-xs font-semibold uppercase text-black/35 md:flex">
                    <Lock className="size-3.5" />
                    End-to-end encrypted
                </span>
            </div>

            <div className="relative mt-7 rounded-[2rem] border-2 border-dashed border-black/10 bg-[#F7FAF5] p-8">
                <div className="min-h-[190px] rounded-[2rem] bg-white/70 p-10 shadow-sm blur-[1px]">
                    <p className="text-lg font-semibold leading-6 text-black/20">
                        Describe what happened... (e.g., This user is sending spam links).
                    </p>
                </div>

                <button className="absolute right-9 top-9 flex size-10 items-center justify-center rounded-full bg-white text-secondary shadow-md">
                    <Search className="size-5" />
                </button>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-black/45">
                <Info className="size-4" />
                Chat logs are private; only user-submitted media is visible for review.
            </p>
        </section>
    );
}