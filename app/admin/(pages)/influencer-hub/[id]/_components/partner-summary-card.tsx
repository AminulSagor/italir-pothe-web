import { UserRound } from "lucide-react";

export default function PartnerSummaryCard() {
    return (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:items-center">
                <div className="flex items-center gap-5">
                    <div className="flex size-14 items-center justify-center rounded-full bg-green-200 text-secondary">
                        <UserRound className="size-6" />
                    </div>

                    <div>
                        <p className="text-sm text-black/50">Partner Name</p>
                        <h2 className="text-xl font-semibold text-black/85">
                            Rahim Italy Vlog
                        </h2>

                        <p className="mt-5 font-bold text-green-700">
                            Active Status <span className="ml-2 text-green-400">●</span>
                        </p>
                        <p className="text-sm text-black/50">Last activity 2h ago</p>
                    </div>
                </div>

                <Metric label="Total Users" value="850" helper="+12%" />
                <Metric label="Rev. Share" value="20%" />
                <Metric label="Lifetime Earnings" value="€12,450" />
            </div>
        </section>
    );
}

function Metric({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <div>
            <p className="text-sm text-black/50">{label}</p>
            <p className="mt-1 text-lg font-light text-black/85">
                {value}
                {helper ? (
                    <span className="ml-2 text-sm font-bold text-green-600">
                        {helper}
                    </span>
                ) : null}
            </p>
        </div>
    );
}