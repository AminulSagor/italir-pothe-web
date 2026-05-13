import { CheckCheck, Plus } from "lucide-react";

const requirements = [
    {
        english: "Valid Passport",
        bangla: "আপনার বৈধ পাসপোর্টের ফটোকপি",
    },
    {
        english: "4 Passport Sized Photos",
        bangla: "৪ কপি পাসপোর্ট সাইজের ছবি",
    },
    {
        english: "Revenue Stamp (€16)",
        bangla: "১৬ ইউরোর রেভিনিউ স্ট্যাম্প",
    },
];

export default function RequirementsCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                    <CheckCheck className="size-5" />
                </span>

                <h2 className="text-xl font-bold text-black/85">
                    Requirements Checklist (প্রয়োজনীয় কাগজপত্র)
                </h2>
            </div>

            <div className="mt-7 space-y-3">
                {requirements.map((item) => (
                    <div key={item.english} className="grid gap-3 md:grid-cols-2">
                        <div className="bg-[#EEF3EC] px-5 py-4 text-black/80">
                            {item.english}
                        </div>

                        <div className="bg-[#EEF3EC] px-5 py-4 text-black/70">
                            {item.bangla}
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-dashed border-black/15 text-lg font-semibold text-deep-green transition hover:bg-[#F7FAF5]">
                <Plus className="size-5" />
                Add Requirement
            </button>
        </section>
    );
}