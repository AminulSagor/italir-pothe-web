import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function RewardUserCard() {
    return (
        <aside className="rounded-[2.5rem] bg-white px-7 py-10 text-center shadow-xl shadow-black/5">
            <div className="relative mx-auto w-fit">
                <Image
                    src="/images/reporter-avatar.png"
                    alt="Alex Johnson"
                    width={132}
                    height={132}
                    className="size-32 rounded-full object-cover shadow-lg"
                />

                <span className="absolute -bottom-2 -right-2 flex size-12 items-center justify-center rounded-full bg-[#75FF33] text-xl">
                    💎
                </span>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-black/85">Alex Johnson</h2>

            <span className="mt-3 inline-flex rounded-full bg-[#DDF7D7] px-5 py-2 text-xs font-bold uppercase text-[#52A447]">
                Diamond League Member
            </span>

            <div className="mt-7 grid grid-cols-2 gap-3">
                <StatBox label="Total XP" value="12.4k" />
                <StatBox label="Ranking" value="#4" />
            </div>

            <div className="mt-7 space-y-3 text-left">
                <ContactRow icon={<Mail className="size-5" />} text="alešj@university.edu" />
                <ContactRow icon={<Phone className="size-5" />} text="+39 345 678 9101" />
            </div>
        </aside>
    );
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.5rem] bg-[#EEF3EC] px-4 py-5">
            <p className="text-xs font-bold uppercase text-black/45">{label}</p>
            <p className="mt-1 text-lg font-bold text-secondary">{value}</p>
        </div>
    );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-3 rounded-full bg-[#EEF3EC] px-5 py-4 text-black/60">
            <span className="text-black/45">{icon}</span>
            <span className="text-sm">{text}</span>
        </div>
    );
}