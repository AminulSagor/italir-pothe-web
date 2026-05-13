"use client";

import { useState } from "react";
import { Ban, Shield, ShieldCheck, TriangleAlert, X } from "lucide-react";
import PermanentBanModal from "./permanent-ban-modal";

export default function AdminActionPanel() {
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isBanSuccess, setIsBanSuccess] = useState(false);

    return (
        <>
            <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-xl shadow-black/5">
                <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-white">
                        <ShieldCheck className="size-6" />
                    </span>

                    <h2 className="text-2xl font-bold text-black/90">Admin Action</h2>
                </div>

                <div className="mt-9">
                    <p className="mb-4 text-xs font-bold uppercase text-black/35">
                        Ban Reason (Mandatory)
                    </p>

                    <textarea
                        placeholder="Describe the violation for internal records and user notification..."
                        className="min-h-[150px] w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-6 text-base leading-7 outline-none placeholder:text-black/40"
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <button className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-secondary px-5 text-lg font-medium text-white">
                        <TriangleAlert className="size-5" />
                        Issue Formal Warning
                    </button>

                    <button
                        onClick={() => setIsBanModalOpen(true)}
                        className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-red-700 px-5 text-lg font-medium text-white"
                    >
                        <Ban className="size-5" />
                        Permanent Account Ban
                    </button>

                    <div className="h-px bg-black/10" />

                    <button className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#DDE3DA] px-5 text-lg font-medium text-black/55">
                        <X className="size-5" />
                        Dismiss Report
                    </button>
                </div>

                <div className="mt-8 rounded-[2rem] bg-green-100 p-6">
                    <p className="text-xs font-bold uppercase text-green-700">
                        Moderator Tip
                    </p>

                    <div className="mt-3 flex gap-3">
                        <Shield className="mt-1 size-5 shrink-0 text-green-700" />

                        <p className="text-sm leading-6 text-green-700">
                            Ensure the provided screenshot’s authenticity clearly violates the
                            guidelines of the platform before issuing a ban.
                        </p>
                    </div>
                </div>
            </aside>

            <PermanentBanModal
                isOpen={isBanModalOpen}
                isSuccess={isBanSuccess}
                onConfirm={() => setIsBanSuccess(true)}
                onClose={() => {
                    setIsBanModalOpen(false);
                    setIsBanSuccess(false);
                }}
            />
        </>
    );
}