import { Banknote, Copy, Handshake, Percent } from "lucide-react";

export default function DealLogicForm() {
    return (
        <div>
            <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#75FF33] text-deep-green">
                    <Banknote className="size-5" />
                </span>

                <div>
                    <h1 className="text-2xl font-bold text-deep-green">Deal & Logic</h1>
                    <p className="mt-1 text-sm text-black/55">
                        Configure commissions and coupons
                    </p>
                </div>
            </div>

            <div className="mt-8 space-y-5">
                <Field label="Coupon Code">
                    <div className="flex h-11 items-center justify-between rounded-full bg-[#EEF3EC] px-5 text-sm font-bold tracking-[0.18em] text-deep-green">
                        ITALY10
                        <Copy className="size-4 text-secondary" />
                    </div>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="User Discount %">
                        <PercentBox icon={<Percent className="size-4" />} value="10" active />
                    </Field>

                    <Field label="Influencer Share %">
                        <PercentBox icon={<Handshake className="size-4" />} value="15" />
                    </Field>
                </div>

                <div className="rounded-[1.7rem] bg-[#DDE4DC] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-deep-green">
                                Lifetime Association
                            </h2>
                            <p className="mt-1 text-sm text-black/55">
                                Tag future orders to this partner
                            </p>
                        </div>

                        <span className="relative h-6 w-11 rounded-full bg-white/70">
                            <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow" />
                        </span>
                    </div>

                    <Field label="Payment Method" className="mt-5">
                        <select className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black/75 outline-none">
                            <option>Direct Bank Transfer (IBAN)</option>
                        </select>
                    </Field>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    children,
    className = "",
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-2 block text-xs font-bold text-black/60">
                {label}
            </span>
            {children}
        </label>
    );
}

function PercentBox({
    icon,
    value,
    active,
}: {
    icon: React.ReactNode;
    value: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex h-12 items-center justify-between rounded-full border px-5 text-deep-green ${active
                    ? "border-green-200 bg-green-100"
                    : "border-secondary/20 bg-[#EEF3EC]"
                }`}
        >
            <span>{icon}</span>
            <span className="text-xl font-bold">{value}</span>
        </div>
    );
}