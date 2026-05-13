import {
    BadgePercent,
    CheckCircle2,
    Rocket,
    ShoppingCart,
    SquarePen,
    X,
} from "lucide-react";

export default function DealLogicPanel() {
    return (
        <div className="p-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-black/85">
                        Deal Logic Configurator
                    </h1>
                    <p className="mt-1 text-sm text-black/50">
                        Configure coupon dynamics and profit sharing.
                    </p>
                </div>

                <button className="text-black/45">
                    <X className="size-5" />
                </button>
            </div>

            <div className="mt-8 rounded-[2rem] bg-[#EEF3EC] p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                    Coupon Code
                </p>

                <div className="mt-3 flex h-14 items-center justify-between rounded-full border border-secondary/20 bg-white px-6 shadow-sm">
                    <p className="text-2xl font-bold tracking-[0.18em] text-deep-green">
                        ITALY10
                    </p>

                    <span className="flex items-center gap-2 text-sm font-bold text-green-700">
                        <CheckCircle2 className="size-4" />
                        AVAILABLE
                    </span>
                </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <PercentCard
                    icon={<ShoppingCart className="size-4" />}
                    label="User Discount"
                    value="10"
                    helper="Off entire basket"
                />

                <PercentCard
                    icon={<BadgePercent className="size-4" />}
                    label="Influencer Share"
                    value="20"
                    helper="Net commission"
                />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-[1.7rem] bg-[#75FF33] p-6 text-deep-green">
                <div>
                    <h3 className="text-lg font-bold">Activate Lifetime Association ✦</h3>
                    <p className="mt-1 max-w-[420px] text-sm leading-5 text-deep-green/75">
                        Link all future purchases from this user permanently to this
                        influencer&apos;s account.
                    </p>
                </div>

                <button className="relative h-8 w-14 rounded-full bg-deep-green">
                    <span className="absolute right-1 top-1 size-6 rounded-full bg-white" />
                </button>
            </div>

            <div className="mt-8 border-t border-black/10 pt-6">
                <button className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-secondary text-base font-semibold text-white shadow-lg shadow-secondary/20">
                    ACTIVATE PARTNER DEAL
                    <Rocket className="size-5" />
                </button>

                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-black/35">
                    Automated payout protocol will be initiated upon first conversion
                </p>
            </div>
        </div>
    );
}

function PercentCard({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    helper: string;
}) {
    return (
        <div className="rounded-[1.7rem] bg-[#EEF3EC] p-5">
            <div className="flex items-center justify-between">
                <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-black/45">
                    <span className="text-secondary">{icon}</span>
                    {label}
                </p>

                <SquarePen className="size-4 text-black/25" />
            </div>

            <div className="mt-4 flex items-end gap-2">
                <span className="flex size-16 items-center justify-center rounded-full bg-white text-4xl font-bold text-black/85 shadow-sm">
                    {value}
                </span>
                <span className="pb-2 text-2xl font-bold text-black/70">%</span>
            </div>

            <p className="mt-2 text-sm text-black/45">{helper}</p>
        </div>
    );
}