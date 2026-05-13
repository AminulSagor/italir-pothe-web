"use client";

import { useState } from "react";
import Button from "@/components/UI/buttons/button";
import CourseDetailsCard from "./course-details-card";
import CourseDeletedDialog from "./course-deleted-dialog";
import DeleteCourseDialog from "./delete-course-dialog";
import SyllabusBuilderCard from "./syllabus-builder-card";
import CoursePublishedDialog from "@/app/admin/(pages)/course-directory/create-course/_components/course-published-dialog";

const CreateCourseForm = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false);
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);

  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setIsDeletedOpen(true);
  };

  return (
    <div className="space-y-6">
      <CourseDetailsCard />
      <SyllabusBuilderCard />

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="ghost"
          size="lg"
          className="text-[#006B3F] !bg-[#f5f1f1]"
        >
          Save as Draft
        </Button>

        <Button size="lg" onClick={() => setIsPublishedOpen(true)}>
          Publish Course
        </Button>
      </div>

      <Button
        variant="ghost"
        size="lg"
        fullWidth
        onClick={() => setIsDeleteOpen(true)}
        className="text-[#D00000] !bg-[#FFE1E1]"
      >
        Delete Course
      </Button>

      <DeleteCourseDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <CourseDeletedDialog
        open={isDeletedOpen}
        onClose={() => setIsDeletedOpen(false)}
      />

      <CoursePublishedDialog
        open={isPublishedOpen}
        onClose={() => setIsPublishedOpen(false)}
      />
    </div>
  );
};

export default CreateCourseForm;
