import { ArrowLeft } from "lucide-react";

interface VocabularyHeaderProps {
  onBack: () => void;
}

export default function VocabularyHeader({ onBack }: VocabularyHeaderProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#7A867D]">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full bg-white text-[#007A4A] shadow-sm"
        >
          <ArrowLeft className="size-4" />
        </button>

        <span>Courses</span>
        <span>/</span>
        <span>Level A1</span>
        <span>/</span>
        <span>Chapter</span>
        <span>/</span>
        <span>Lesson</span>
        <span>/</span>
        <span className="text-[#007A4A]">Vocabulary</span>
      </div>

      <h1 className="text-2xl font-bold text-[#007A4A] sm:text-3xl">
        Manage Vocabulary
      </h1>

      <p className="mt-1 text-sm text-[#66736B]">
        Create Vocabulary List & Manage Them
      </p>
    </div>
  );
}
