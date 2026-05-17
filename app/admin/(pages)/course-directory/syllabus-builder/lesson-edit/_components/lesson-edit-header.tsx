import BackButton from "@/components/UI/buttons/back-button";

export default function LessonEditHeader() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#66736B]">
        <BackButton />

        <span>Courses</span>
        <span>{">"}</span>
        <span>Level A1</span>
        <span>{">"}</span>
        <span>Chapter 1</span>
        <span>{">"}</span>
        <span className="font-semibold text-[#006B3F]">
          Lesson 1.1: Basic Hellos
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#202420] sm:text-3xl">
        Edit Lesson Content
      </h1>
    </div>
  );
}
