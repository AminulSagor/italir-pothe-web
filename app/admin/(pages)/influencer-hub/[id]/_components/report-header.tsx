import { Download } from "lucide-react";

export default function ReportHeader() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
                <p className="text-sm text-black/50">
                    Influencers <span className="mx-2">›</span>
                    <span className="font-semibold text-secondary">Rahim Italy Vlog</span>
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-green">
                    Rahim Italy Vlog Report
                </h1>
            </div>

            <button className="flex h-10 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold text-black/70 shadow-sm">
                <Download className="size-4" />
                Export CSV
            </button>
        </div>
    );
}