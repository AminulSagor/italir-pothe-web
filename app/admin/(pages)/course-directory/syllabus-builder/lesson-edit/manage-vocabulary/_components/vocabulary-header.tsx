import BackButton from "@/components/UI/buttons/back-button";

export default function VocabularyHeader() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#7A867D]">
        <BackButton />

        <span>Courses</span>
        <span>/</span>
        <span>Level A1</span>
        <span>/</span>
        <span>Chapter 1</span>
        <span>/</span>
        <span>Lesson 1.1</span>
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
