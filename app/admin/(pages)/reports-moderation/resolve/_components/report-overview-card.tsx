import Image from "next/image";
import { ClipboardList, Mail, Phone } from "lucide-react";

export default function ReportOverviewCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                    <ClipboardList className="size-5" />
                </span>

                <h2 className="text-2xl font-bold text-black/90">Report Overview</h2>
            </div>

            <div className="mt-7 grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
                <div>
                    <p className="mb-3 text-xs font-bold uppercase text-black/35">
                        Reporter
                    </p>

                    <div className="flex items-start gap-3">
                        <Image
                            src="/images/reporter-avatar.png"
                            alt="Reporter"
                            width={44}
                            height={44}
                            className="size-11 rounded-full object-cover"
                        />

                        <div>
                            <p className="font-bold text-black/85">Fahid Hasan</p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-black/45">
                                <Phone className="size-4" />
                                +39 312 456 7890
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-black/45">
                                <Mail className="size-4" />
                                fahidh@shikhi.it
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-xs font-bold uppercase text-black/35">
                        Reason
                    </p>

                    <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase text-red-600">
                        Spam Content
                    </span>
                </div>

                <div>
                    <p className="mb-3 text-xs font-bold uppercase text-black/35">
                        Submitted On
                    </p>

                    <p className="text-lg text-black/75">Oct 24, 2023 · 14:32</p>
                </div>
            </div>
        </section>
    );
}