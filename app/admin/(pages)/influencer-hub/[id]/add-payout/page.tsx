import Link from "next/link";
import { Banknote, CalendarDays, ChevronDown, X } from "lucide-react";

export default function AddPayoutPage() {
    return (
        <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-white/55 backdrop-blur-md" />

            <section className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                <div className="px-8 py-7">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#75FF33] text-deep-green">
                                <Banknote className="size-5" />
                            </span>

                            <h1 className="text-xl font-bold text-black/90">
                                Add Manual Payout
                            </h1>
                        </div>

                        <Link href="/admin/influencer-hub/rahim-italy-vlog">
                            <X className="size-5 text-black/45" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Field label="Transaction Date">
                            <div className="flex h-11 items-center justify-between rounded-full bg-[#EEF3EC] px-5 text-sm text-black/75">
                                Oct 15, 2023
                                <CalendarDays className="size-4 text-black/45" />
                            </div>
                        </Field>

                        <Field label="Amount (€)">
                            <div className="flex h-11 items-center rounded-full bg-[#EEF3EC] px-5 text-sm text-black/45">
                                <span className="mr-2 font-bold text-secondary">€</span>
                                0.00
                            </div>
                        </Field>
                    </div>

                    <div className="mt-5">
                        <Field label="Adjustment Type">
                            <div className="flex h-11 items-center justify-between rounded-full bg-[#EEF3EC] px-5 text-sm text-black/75">
                                Manual Adjustment
                                <ChevronDown className="size-4 text-black/45" />
                            </div>
                        </Field>
                    </div>

                    <div className="mt-5">
                        <Field label="Internal Reference / ID">
                            <div className="flex h-11 items-center rounded-full bg-[#EEF3EC] px-5 text-sm text-black/40">
                                #TR-NEW
                            </div>
                        </Field>
                    </div>

                    <div className="mt-5">
                        <Field label="Notes">
                            <div className="flex h-20 rounded-[1.5rem] bg-[#EEF3EC] px-5 py-4 text-sm leading-6 text-black/40">
                                Add administrative context or reason for adjustment...
                            </div>
                        </Field>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-[1.5rem] bg-[#EEF3EC] px-5 py-4">
                        <div>
                            <h2 className="font-bold text-black/85">Payment Status</h2>
                            <p className="mt-1 max-w-[230px] text-sm leading-5 text-black/55">
                                Mark entry as completed or waiting processing
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="relative h-7 w-12 rounded-full bg-green-700">
                                <span className="absolute right-1 top-1 size-5 rounded-full bg-white" />
                            </span>
                            <span className="text-sm font-medium text-green-700">PAID</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-[#F5FAF3] px-8 py-6">
                    <Link
                        href="/admin/influencer-hub/rahim-italy-vlog"
                        className="text-sm text-black/65"
                    >
                        Cancel
                    </Link>

                    <button className="h-12 rounded-full bg-secondary px-9 text-sm font-semibold text-white shadow-lg shadow-secondary/20">
                        Confirm & Log Entry
                    </button>
                </div>
            </section>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/55">
                {label}
            </span>
            {children}
        </label>
    );
}