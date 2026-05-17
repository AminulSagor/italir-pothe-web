import Image from "next/image";
import { BookOpen, Eye, Plane, UserRound } from "lucide-react";

export default function SubjectStatsCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-secondary">
                    <UserRound className="size-5" />
                </span>

                <h2 className="text-lg font-bold text-black/90">Subject Stats</h2>
            </div>

            <div className="mt-7 flex items-center gap-4">
                <div className="relative">
                    <Image
                        src="/images/alex-rivera.png"
                        alt="Alex Rivera"
                        width={64}
                        height={64}
                        className="size-16 rounded-full object-cover"
                    />

                    <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                        24
                    </span>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-black/90">Alex Rivera</h3>
                    <p className="text-sm leading-5 text-black/45">
                        Member since Jan <br /> 2022
                    </p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <StatPill label="Streak" value="112 Days" />
                <StatPill label="Total XP" value="12.4k" />
                <StatPill label="Purchase Value" value="€120.00" />
            </div>

            <div className="mt-7 rounded-[2rem] bg-[#EEF3EC] p-5">
                <p className="mb-4 text-xs font-semibold uppercase text-black/35">
                    Course Enrollment
                </p>

                <CourseRow
                    icon={<BookOpen className="size-4" />}
                    title="Beginner Italian A1"
                    status="Active Student"
                />

                <div className="my-3 h-px bg-black/10" />

                <CourseRow
                    icon={<Plane className="size-4" />}
                    title="Italian for Travelers"
                    status="Completed"
                />
            </div>
        </section>
    );
}

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.5rem] bg-[#EEF3EC] p-5 text-center">
            <p className="text-xs font-semibold uppercase text-black/35">{label}</p>
            <p className="mt-2 text-xl font-bold text-secondary">{value}</p>
        </div>
    );
}

function CourseRow({
    icon,
    title,
    status,
}: {
    icon: React.ReactNode;
    title: string;
    status: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                    {icon}
                </span>

                <div>
                    <p className="font-bold leading-5 text-black/85">{title}</p>
                    <p className="text-xs uppercase text-black/35">{status}</p>
                </div>
            </div>

            <button className="flex size-8 items-center justify-center rounded-full bg-white text-secondary">
                <Eye className="size-4" />
            </button>
        </div>
    );
}