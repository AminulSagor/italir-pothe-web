"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComposerHeader() {
    const router = useRouter();

    return (
        <div className="flex items-start gap-5">
            <button
                type="button"
                onClick={() => router.back()}
                className="mt-1 flex size-10 items-center justify-center rounded-full bg-black/5 text-black/60 transition hover:bg-black/10"
            >
                <ArrowLeft className="size-5" />
            </button>

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-deep-green">
                    Push Notification Composer
                </h1>
                <p className="mt-2 text-sm text-black/55">
                    Engage your students with localized campaign messages.
                </p>
            </div>
        </div>
    );
}