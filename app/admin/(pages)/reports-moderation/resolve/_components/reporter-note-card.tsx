import { MessageSquareText } from "lucide-react";

export default function ReporterNoteCard() {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-purple-50 text-secondary">
                    <MessageSquareText className="size-5" />
                </span>

                <h2 className="text-lg font-bold leading-tight text-black/90">
                    Reporter <br /> Note
                </h2>
            </div>

            <div className="mt-7 min-h-[310px] rounded-[2rem] bg-[#F4F8F1] p-7">
                <p className="text-lg leading-8 text-black/65">
                    “This user is sending spam links in the public community channel and
                    DMing several members with suspicious investment opportunities.”
                </p>
            </div>
        </section>
    );
}