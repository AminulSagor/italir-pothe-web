import { MessageSquareText } from "lucide-react";

interface ReporterNoteCardProps {
  note: string | null;
}

export default function ReporterNoteCard({ note }: ReporterNoteCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-purple-50 text-secondary">
          <MessageSquareText className="size-5" />
        </span>

        <h2 className="text-lg font-bold leading-tight text-black/90">
          Reporter Note
        </h2>
      </div>

      <div className="mt-7 min-h-[230px] rounded-[2rem] bg-[#F4F8F1] p-7">
        <p className="whitespace-pre-wrap text-base leading-7 text-black/65">
          {note?.trim() || "No written description was provided by the reporter."}
        </p>
      </div>
    </section>
  );
}
