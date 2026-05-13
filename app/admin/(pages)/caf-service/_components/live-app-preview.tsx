import { Eye } from "lucide-react";
import { cafPreviewServices } from "../../../../../mock/caf-service/caf-service.mock";

const toneClass = {
    purple: "bg-purple-100 text-rose-700",
    green: "bg-emerald-100 text-secondary",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-sky-100 text-secondary",
};

export default function LiveAppPreview() {
    return (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-secondary">
                    <Eye className="size-4" />
                </span>

                <div>
                    <h2 className="text-xl font-bold text-black/85">Live App Preview</h2>
                    <p className="mt-1 text-sm text-black/55">
                        Drag and drop cards to reorder how they appear in the mobile app.
                    </p>
                </div>
            </div>

            <div className="mt-7 flex gap-6 overflow-x-auto pb-2">
                {cafPreviewServices.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            className={`flex h-[170px] w-[150px] shrink-0 flex-col justify-between rounded-[1.7rem] p-6 ${toneClass[item.tone]}`}
                        >
                            <span className="flex size-10 items-center justify-center rounded-full bg-white/65">
                                <Icon className="size-5" />
                            </span>

                            <div>
                                <h3 className="text-sm font-bold uppercase leading-4 text-black/85">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-xs uppercase tracking-widest text-black/55">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <div className="h-[170px] w-[90px] shrink-0 rounded-[1.7rem] border-2 border-dashed border-black/15" />
            </div>
        </section>
    );
}