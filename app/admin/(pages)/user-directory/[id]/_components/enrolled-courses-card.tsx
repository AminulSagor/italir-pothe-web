import { BookOpen, BriefcaseMedical, GraduationCap, Languages } from "lucide-react";

export default function EnrolledCoursesCard() {
    const courses = [
        {
            title: "Italian A1: Beginner Foundations",
            progress: 84,
            color: "bg-secondary",
            icon: BookOpen,
            iconClass: "bg-emerald-50 text-secondary",
        },
        {
            title: "Medical Italian Terminology",
            progress: 12,
            color: "bg-[#9B4DFF]",
            icon: BriefcaseMedical,
            iconClass: "bg-purple-50 text-[#9B4DFF]",
        },
        {
            title: "Italian Culture & Arts",
            progress: 0,
            color: "bg-[#E59A4A]",
            icon: Languages,
            iconClass: "bg-orange-50 text-[#E59A4A]",
        },
    ];

    return (
        <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="mb-7 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <GraduationCap className="size-5" />
                </span>

                <h2 className="text-lg font-semibold text-black/90">
                    Enrolled Courses
                </h2>
            </div>

            <div className="space-y-8">
                {courses.map((course) => {
                    const Icon = course.icon;

                    return (
                        <div key={course.title}>
                            <div className="flex items-center gap-4">
                                <span
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${course.iconClass}`}
                                >
                                    <Icon className="size-5" />
                                </span>

                                <div>
                                    <h3 className="text-lg font-semibold text-black/90">
                                        {course.title}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium uppercase text-black/35">
                                        {course.progress}% Progress
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6ECE4]">
                                <div
                                    className={`h-full rounded-full ${course.color}`}
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}