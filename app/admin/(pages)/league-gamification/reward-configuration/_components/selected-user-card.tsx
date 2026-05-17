import Image from "next/image";

export default function SelectedUserCard() {
    return (
        <section className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <Image
                        src="/images/reporter-avatar.png"
                        alt="Alex Johnson"
                        width={56}
                        height={56}
                        className="size-14 rounded-full object-cover"
                    />

                    <div>
                        <h3 className="text-xl font-bold leading-tight text-black/85">
                            Alex Johnson
                        </h3>

                        <p className="mt-1 text-base leading-5 text-black/60">
                            Level A1 Beginner •
                        </p>

                        <p className="text-base leading-5 text-black/60">12,400 XP</p>
                    </div>
                </div>

                <div className="flex min-w-[210px] flex-col gap-3">
                    <span className="rounded-full bg-[#75FF75] px-6 py-2 text-center text-sm font-bold uppercase text-secondary">
                        Top 1% Learner
                    </span>

                    <span className="rounded-full bg-[#DDE3DA] px-6 py-3 text-center text-sm font-medium uppercase text-black/60">
                        Platinum League
                    </span>
                </div>
            </div>
        </section>
    );
}