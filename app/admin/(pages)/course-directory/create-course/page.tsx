import CreateCourseForm from "./_components/create-course-form";
import CourseProgressCard from "./_components/course-progress-card";
import CourseStatusCard from "./_components/course-status-card";
import FinalExaminationCard from "./_components/final-examination-card";
import PricingAccessCard from "./_components/pricing-access-card";

const CreateCoursePage = () => {
  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm text-black/60">
          Courses › <span className="font-semibold text-[#006B3F]">Setup</span>
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#202420]">
          Create New Course
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <CreateCourseForm />

        <aside className="space-y-6">
          <CourseProgressCard />
          <PricingAccessCard />
          <CourseStatusCard />
          <FinalExaminationCard />
        </aside>
      </div>
    </section>
  );
};

export default CreateCoursePage;
