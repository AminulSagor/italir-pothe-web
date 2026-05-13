import { Camera } from "lucide-react";

export default function CampaignDetailsCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-black/45">
                Campaign Details
            </p>

            <div className="mt-6 space-y-4">
                <input
                    placeholder="Notification Title (e.g., New B1 Practice Material)"
                    className="h-12 w-full rounded-3xl bg-[#EEF3EC] px-5 text-sm outline-none placeholder:text-black/40"
                />

                <textarea
                    placeholder="Notification Body Message... Keep it snappy and engaging."
                    className="h-24 w-full resize-none rounded-3xl bg-[#EEF3EC] px-5 py-4 text-sm outline-none placeholder:text-black/40"
                />
            </div>

            <p className="mt-10 text-sm font-bold uppercase tracking-[0.22em] text-black/45">
                Rich Media
            </p>

            <div className="mt-5 flex h-32 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-black/20 text-center">
                <Camera className="size-7 text-secondary" />
                <p className="mt-3 text-base font-bold text-secondary">
                    Click or drag image to upload
                </p>
                <p className="mt-1 text-sm text-black/45">
                    Recommended: 1024×512px (JPG, PNG)
                </p>
            </div>
        </section>
    );
}