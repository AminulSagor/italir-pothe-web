"use client";

import { useState } from "react";
import { ArrowLeft, Gift } from "lucide-react";
import RewardSuccessModal from "./reward-success-modal";

export default function RewardHeader() {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <button className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-secondary">
                        <ArrowLeft className="size-4" />
                        Back to Rewards
                    </button>

                    <h1 className="text-2xl font-bold tracking-tight text-black/90">
                        Reward Configuration
                    </h1>

                    <p className="mt-2 text-base text-black/60">
                        Set up and dispatch physical rewards for top performing students.
                    </p>
                </div>

                <button
                    onClick={() => setIsSuccessModalOpen(true)}
                    className="flex h-14 items-center justify-center gap-3 rounded-full bg-secondary px-10 text-lg font-semibold text-white shadow-lg shadow-green-900/15"
                >
                    <Gift className="size-5" />
                    Confirm Gift
                </button>
            </div>

            <RewardSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </>
    );
}