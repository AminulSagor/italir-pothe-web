interface ExamCourseOption {
  id: string;
  title: string;
}

interface ExamBasicFieldsProps {
  examName: string;
  linkedCourseId: string;
  linkedCourse: string;
  courseOptions: ExamCourseOption[];
  isCourseLoading?: boolean;
  onExamNameChange: (value: string) => void;
  onCourseChange: (courseId: string) => void;
}

const ExamBasicFields = ({
  examName,
  linkedCourseId,
  linkedCourse,
  courseOptions,
  isCourseLoading = false,
  onExamNameChange,
  onCourseChange,
}: ExamBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Exam Name
        </label>

        <input
          value={examName}
          onChange={(event) => onExamNameChange(event.target.value)}
          className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Link To Course
        </label>

        <select
          value={linkedCourseId}
          disabled={isCourseLoading}
          onChange={(event) => onCourseChange(event.target.value)}
          className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{linkedCourse || "Select course"}</option>

          {courseOptions.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExamBasicFields;
