import Image from "next/image";
import { Ban, Gift, Trophy } from "lucide-react";

export default function UserProfileCard() {
    return (
        <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <Image
                        src="/images/alex-rivera.png"
                        alt="User"
                        width={140}
                        height={140}
                        className="size-[140px] rounded-[2rem] object-cover"
                    />

                    <div>
                        <h2 className="text-2xl font-bold text-secondary">
                            Alessandro Rossi
                        </h2>

                        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#F2C08C] bg-[#FFF3E7] px-5 py-3">
                            <Trophy className="size-5 text-[#D86A00]" />

                            <div>
                                <p className="text-xs font-semibold uppercase text-[#D86A00]">
                                    Total Progress
                                </p>

                                <p className="text-2xl font-bold text-black/90">
                                    12,450 XP
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <span className="rounded-full bg-[#DDF3EC] px-5 py-2 text-sm font-semibold text-secondary">
                                Joined Oct 2023
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button className="flex h-16 items-center justify-center gap-3 rounded-full bg-secondary px-10 text-lg font-semibold text-white shadow-lg shadow-green-900/15">
                        <Gift className="size-5" />
                        Gift Reward
                    </button>

                    <button className="flex h-16 items-center justify-center gap-3 rounded-full bg-[#DDE3DA] px-10 text-lg font-medium text-black/65">
                        <Ban className="size-5" />
                        Restrict Account
                    </button>
                </div>
            </div>
        </section>
    );
}