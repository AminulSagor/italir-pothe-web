export default function ModerationHeader() {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-black/90">
                    Report & Moderation Center
                </h1>

                <p className="mt-2 text-sm text-black/55">
                    Review and resolve flagged content across the platform.
                </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black/70 shadow-sm">
                <span className="mr-2 inline-block size-2 rounded-full bg-[#75FF33]" />
                Realtime Feed Active
            </div>
        </div>
    );
}