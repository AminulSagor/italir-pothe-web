import { Check, Search, UsersRound } from "lucide-react";

interface TargetAudienceCardProps {
    showDropdown?: boolean;
}

export default function TargetAudienceCard({
    showDropdown = false,
}: TargetAudienceCardProps) {
    return (
        <section className="relative rounded-[2rem] bg-white px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-secondary">
                        <UsersRound className="size-4" />
                    </span>

                    <h2 className="text-lg font-semibold text-black/85">
                        Target Audience
                    </h2>
                </div>

                <a
                    href="/admin/notification-management/create?mode=send-now"
                    className="rounded-full border border-green-300 bg-green-50 px-6 py-2 text-sm font-bold text-secondary"
                >
                    + Add User
                </a>
            </div>

            <div className="mt-4">
                <span className="inline-flex rounded-full bg-[#EEF3EC] px-4 py-2 text-sm text-black/60">
                    All Users ×
                </span>
            </div>

            {showDropdown && <AudienceDropdown />}
        </section>
    );
}

function AudienceDropdown() {
    return (
        <div className="absolute right-8 top-[72px] z-20 w-[330px] rounded-[2rem] bg-white/90 p-6 shadow-2xl backdrop-blur">
            <div className="flex h-12 items-center gap-3 rounded-full bg-[#EEF3EC] px-5 text-black/45">
                <Search className="size-4" />
                <span className="text-sm">Search Users..</span>
            </div>

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-black/45">
                Course Students
            </p>

            <div className="mt-5 space-y-5 text-base text-black/75">
                <AudienceRow label="Level A1 (Beginners)" />
                <AudienceRow label="Level B2 (Intermediate)" active />
                <AudienceRow label="Level C1 (Advanced)" />
            </div>

            <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-black/45">
                User Status
            </p>

            <div className="mt-5 space-y-5 text-base text-black/75">
                <SwitchRow label="Active Subscribers" active />
                <SwitchRow label="Trial Users" />
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
                <button className="text-sm font-bold text-black/55">Clear All</button>
                <button className="h-11 flex-1 rounded-full bg-secondary text-sm font-bold text-white shadow-lg shadow-secondary/20">
                    Apply User
                </button>
            </div>
        </div>
    );
}

function AudienceRow({ label, active }: { label: string; active?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>

            <span
                className={`flex size-4 items-center justify-center rounded-full border ${active
                    ? "border-secondary bg-secondary text-white"
                    : "border-black/20 bg-white"
                    }`}
            >
                {active ? <Check className="size-3.5" /> : null}
            </span>
        </div>
    );
}

function SwitchRow({ label, active }: { label: string; active?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>

            <span
                className={`relative h-6 w-12 rounded-full ${active ? "bg-emerald-100" : "bg-black/10"
                    }`}
            >
                <span
                    className={`absolute top-1 size-4 rounded-full ${active ? "right-1 bg-secondary" : "left-1 bg-white"
                        }`}
                />
            </span>
        </div>
    );
}