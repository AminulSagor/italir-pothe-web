import { ClipboardList } from "lucide-react";

export default function ExamResultsCard() {
    const exams = [
        {
            title: "Exam A1",
            time: "Completed yesterday",
            score: "92%",
            color: "bg-[#DDF3D9]",
            badge: "A1",
        },
        {
            title: "Exam A2",
            time: "2 days ago",
            score: "85%",
            color: "bg-[#DDF3D9]",
            badge: "A1",
        },
        {
            title: "Exam A3",
            time: "Last week",
            score: "74%",
            color: "bg-[#F0DDF7]",
            badge: "B1",
        },
    ];

    return (
        <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="mb-7 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <ClipboardList className="size-5" />
                </span>

                <h2 className="text-lg font-semibold text-black/90">Exam Results</h2>
            </div>

            <div className="space-y-7">
                {exams.map((exam) => (
                    <div
                        key={exam.title}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex size-14 items-center justify-center rounded-full text-lg font-bold text-secondary ${exam.color}`}
                            >
                                {exam.badge}
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-black/90">
                                    {exam.title}
                                </h3>

                                <p className="text-base text-black/45">{exam.time}</p>
                            </div>
                        </div>

                        <h3 className="text-[2rem] font-bold text-secondary">
                            {exam.score}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}