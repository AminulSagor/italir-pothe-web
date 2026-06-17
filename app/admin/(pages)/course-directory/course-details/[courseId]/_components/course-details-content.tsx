"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getCourseById } from "@/service/course-directory/course.service";
import type { Course } from "@/types/course-directory/course.type";

import CourseDetailsHeader from "./course-details-header";
import CourseDetailsStats from "./course-details-stats";
import EnrollmentListTable from "./enrollment-list-table";

interface CourseDetailsContentProps {
  courseId: string;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const CourseDetailsContent = ({ courseId }: CourseDetailsContentProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        setIsLoading(true);

        const response = await getCourseById(courseId);

        if (isMounted) {
          setCourse(response);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <section className="space-y-7">
        <div className="rounded-3xl bg-white px-6 py-10 text-sm text-black/60">
          Loading course details...
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="space-y-7">
        <div className="rounded-3xl bg-white px-6 py-10 text-sm text-black/60">
          Course not found.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-7">
      <CourseDetailsHeader course={course} />
      <CourseDetailsStats course={course} />
      <EnrollmentListTable course={course} />
    </section>
  );
};

export default CourseDetailsContent;
