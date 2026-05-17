import { ArrowLeft } from "lucide-react";

export default function UserDetailsHeader() {
    return (
        <div>
            <div className="flex items-center gap-4">
                <button className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/60">
                    <ArrowLeft className="size-5" />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-secondary">
                        User Details
                    </h1>

                    <p className="mt-1 text-base text-black/45">
                        Get To know your user
                    </p>
                </div>
            </div>
        </div>
    );
}