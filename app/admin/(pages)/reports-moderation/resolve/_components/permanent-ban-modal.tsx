import { Ban, Gavel, ShieldCheck } from "lucide-react";

interface PermanentBanModalProps {
    isOpen: boolean;
    isSuccess: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function PermanentBanModal({
    isOpen,
    isSuccess,
    onClose,
    onConfirm,
}: PermanentBanModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
            {isSuccess ? (
                <div className="w-full max-w-[520px] rounded-[4rem] bg-[#F7FAF5] px-8 py-12 text-center shadow-2xl">
                    <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-secondary text-white shadow-lg shadow-green-900/20">
                        <ShieldCheck className="size-12" />
                    </div>

                    <h2 className="mt-8 text-2xl font-bold leading-tight text-deep-green">
                        Account Successfully Banned
                    </h2>

                    <p className="mx-auto mt-6 max-w-[420px] text-xl leading-8 text-black/60">
                        Alex Rivera&apos;s account has been restricted. They will no longer
                        have access to courses, XP, or community features. A notification has
                        been sent to their registered email.
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-12 flex h-16 w-full items-center justify-center rounded-full bg-secondary text-xl font-bold text-white shadow-lg shadow-green-900/20"
                    >
                        Return to Queue
                    </button>

                    <p className="mt-8 text-sm font-bold uppercase tracking-wide text-black/15">
                        Action logged by system admin
                    </p>
                </div>
            ) : (
                <div className="w-full max-w-[520px] rounded-[4rem] bg-[#F7FAF5] px-8 py-10 shadow-2xl">
                    <div className="flex justify-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-red-50 text-red-800">
                            <Ban className="size-9" />
                        </div>
                    </div>

                    <h2 className="mt-7 text-center text-2xl font-bold text-black/90">
                        Confirm Permanent Ban
                    </h2>

                    <p className="mx-auto mt-5 max-w-[420px] text-center text-lg leading-6 text-black/60">
                        This action cannot be undone. The user Alex Rivera will lose access
                        to all courses, XP, and community features immediately.
                    </p>

                    <div className="mt-9 rounded-[2rem] border border-black/5 bg-[#EEF3EC] px-6 py-7 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-black/35">
                            Violation Summary
                        </p>

                        <p className="mt-3 text-2xl font-medium text-red-800">
                            Spam Content
                        </p>
                    </div>

                    <button
                        onClick={onConfirm}
                        className="mt-10 flex h-20 w-full items-center justify-center gap-4 rounded-full bg-[#8E1D2C] text-lg font-medium text-white"
                    >
                        <Gavel className="size-7" />
                        Confirm & Ban Account
                    </button>

                    <button
                        onClick={onClose}
                        className="mt-5 flex h-20 w-full items-center justify-center rounded-full bg-[#DDE3DA] text-lg font-medium text-black/60"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}