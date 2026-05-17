import BackButton from "@/components/UI/buttons/back-button";

export default function SyllabusHeader() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-xs text-[#66736B]">
        <BackButton />

        <span>Courses</span>
        <span>{">"}</span>
        <span>Level A1</span>
        <span>{">"}</span>
        <span className="font-semibold text-[#006B3F]">Syllabus</span>
      </div>

      <h1 className="text-2xl font-bold text-[#202420] sm:text-3xl">
        Syllabus Builder
      </h1>
    </div>
  );
}
