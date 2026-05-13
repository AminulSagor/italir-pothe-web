import { ListOrdered, Plus } from "lucide-react";

const steps = [
    {
        step: 1,
        title: "Go to the Post Office",
        subtitle: "পোস্ট অফিসে যান",
    },
    {
        step: 2,
        title: "Fill out Kit Giallo",
        subtitle: "হলুদ কিটটি পূরণ করুন",
    },
];

export default function HowToApplyCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                    <ListOrdered className="size-5" />
                </span>

                <h2 className="text-xl font-bold text-black/85">
                    How to Apply (Come Fare)
                </h2>
            </div>

            <div className="mt-8 space-y-6">
                {steps.map((item) => (
                    <div key={item.step} className="flex gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-white">
                            {item.step}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="bg-[#EEF3EC] px-5 py-4 text-black/85">
                                {item.title}
                            </div>

                            <div className="bg-[#EEF3EC] px-5 py-4 text-black/70">
                                {item.subtitle}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-dashed border-black/15 text-lg font-semibold text-secondary transition hover:bg-[#F7FAF5]">
                <Plus className="size-5" />
                Add Step
            </button>
        </section>
    );
}