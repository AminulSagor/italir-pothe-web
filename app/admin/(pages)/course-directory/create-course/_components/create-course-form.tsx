"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import {
  archiveCourse,
  checkPermanentDeleteCourse,
  createCourse,
  getCourseById,
  permanentlyDeleteCourse,
  publishCourse,
  restoreArchivedCourse,
  updateCourse,
} from "@/service/course-directory/course.service";
import type {
  Course,
  CourseDeleteSafety,
  CourseStatus,
  CreateCoursePayload,
} from "@/types/course-directory/course.type";

import ArchiveCourseDialog from "./archive-course-dialog";
import CourseDetailsCard from "./course-details-card";
import CourseProgressCard from "./course-progress-card";
import CoursePublishedDialog from "./course-published-dialog";
import CourseStatusCard from "./course-status-card";
import DeleteCourseDialog from "./delete-course-dialog";
import FinalExaminationCard from "./final-examination-card";
import PricingAccessCard from "./pricing-access-card";
import SyllabusBuilderCard from "./syllabus-builder-card";
import RestoreCourseDialog from "./restore-course-dialog";

const COURSE_DIRECTORY_PATH = "/admin/course-directory";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const getCoursePrice = (course: Course | null) => {
  if (!course?.price) return "0.00";

  const price = Number(course.price);

  return Number.isNaN(price) ? "0.00" : price.toFixed(2);
};

interface CreateCourseFormProps {
  courseId?: string;
}

const CreateCourseForm = ({ courseId = "" }: CreateCourseFormProps) => {
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("0.00");
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<CourseStatus>("draft");

  const [deleteSafety, setDeleteSafety] = useState<CourseDeleteSafety | null>(
    null,
  );
  const [pendingRestoreStatus, setPendingRestoreStatus] =
    useState<CourseStatus | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingDelete, setIsCheckingDelete] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);

  const isEditMode = Boolean(courseId);
  const activeCourseId = course?.id || courseId;
  const pageTitle = isEditMode ? "Manage Course" : "Create New Course";
  const generatedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    const loadCourse = async () => {
      try {
        setIsLoading(true);

        const response = await getCourseById(courseId);

        if (!isMounted) return;

        setCourse(response);
        setTitle(response.title || "");
        setSubtitle(response.subtitle || "");
        setDescription(response.description || "");
        setIsFree(
          response.isFree || !response.price || Number(response.price) === 0,
        );
        setPrice(getCoursePrice(response));
        setCouponCode(response.couponCode || "");
        setStatus((response.status || "draft") as CourseStatus);
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

  const buildPayload = (payloadStatus: CourseStatus): CreateCoursePayload => {
    const numericPrice = Number(price);
    const safePrice = Number.isNaN(numericPrice) ? 0 : numericPrice;

    return {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      slug: course?.slug || generatedSlug,
      isFree,
      price: isFree ? null : safePrice,
      couponCode: couponCode.trim() || null,
      status: payloadStatus,
    };
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Course title is required.");
      return false;
    }

    if (!subtitle.trim()) {
      toast.error("Course subtitle is required.");
      return false;
    }

    if (!generatedSlug && !course?.slug) {
      toast.error("Course slug could not be generated.");
      return false;
    }

    return true;
  };

  const saveCourse = async (payloadStatus: CourseStatus) => {
    if (!validateForm()) return null;

    const payload = buildPayload(payloadStatus);

    if (activeCourseId) {
      const updatedCourse = await updateCourse(activeCourseId, payload);

      setCourse(updatedCourse);
      setStatus(updatedCourse.status);

      return updatedCourse;
    }

    const createdCourse = await createCourse(payload);

    setCourse(createdCourse);
    setStatus(createdCourse.status);

    router.replace(
      `/admin/course-directory/create-course?courseId=${createdCourse.id}`,
      {
        scroll: false,
      },
    );

    return createdCourse;
  };

  const handleSaveDraft = async () => {
    if (isSaving) return;

    const toastId = toast.loading("Saving course draft...");

    try {
      setIsSaving(true);

      const savedCourse = await saveCourse("draft");

      if (!savedCourse) {
        toast.dismiss(toastId);
        return;
      }

      toast.success("Course draft saved successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const toastId = toast.loading("Publishing course...");

    try {
      setIsSaving(true);

      const savedCourse = await saveCourse("draft");

      if (!savedCourse) {
        toast.dismiss(toastId);
        return;
      }

      const publishedCourse = await publishCourse(savedCourse.id);

      setCourse(publishedCourse);
      setStatus(publishedCourse.status);
      setIsPublishedOpen(true);

      toast.success("Course published successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!activeCourseId) {
      toast.error("Save the course before deleting it permanently.");
      return;
    }

    try {
      setIsCheckingDelete(true);

      const safety = await checkPermanentDeleteCourse(activeCourseId);

      setDeleteSafety(safety);
      setIsDeleteOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCheckingDelete(false);
    }
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!activeCourseId || !deleteSafety?.canDeletePermanently) return;

    const toastId = toast.loading("Deleting course permanently...");

    try {
      setIsSaving(true);

      await permanentlyDeleteCourse(activeCourseId);

      toast.success("Course permanently deleted.", {
        id: toastId,
      });

      router.push(COURSE_DIRECTORY_PATH);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
      setIsDeleteOpen(false);
    }
  };

  const refreshCourse = async (targetCourseId: string) => {
    const refreshedCourse = await getCourseById(targetCourseId);

    setCourse(refreshedCourse);
    setTitle(refreshedCourse.title || "");
    setSubtitle(refreshedCourse.subtitle || "");
    setDescription(refreshedCourse.description || "");
    setIsFree(
      refreshedCourse.isFree ||
        !refreshedCourse.price ||
        Number(refreshedCourse.price) === 0,
    );
    setPrice(getCoursePrice(refreshedCourse));
    setCouponCode(refreshedCourse.couponCode || "");
    setStatus((refreshedCourse.status || "draft") as CourseStatus);

    return refreshedCourse;
  };

  const handleStatusChange = async (nextStatus: CourseStatus) => {
    if (nextStatus === status || isSaving) return;

    if (nextStatus === "archived") {
      if (!activeCourseId) {
        toast.error("Save the course before archiving it.");
        return;
      }

      setIsArchiveOpen(true);
      return;
    }

    if (status === "archived") {
      if (!activeCourseId) {
        toast.error("Course ID is missing.");
        return;
      }

      setPendingRestoreStatus(nextStatus);
      setIsRestoreOpen(true);
      return;
    }

    setStatus(nextStatus);
  };

  const handleArchiveConfirm = async () => {
    if (!activeCourseId) return;

    const toastId = toast.loading("Archiving course...");

    try {
      setIsSaving(true);

      const archivedCourse = await archiveCourse(activeCourseId);

      setCourse(archivedCourse);
      setStatus((archivedCourse.status || "archived") as CourseStatus);

      await refreshCourse(activeCourseId);

      toast.success("Course archived successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
      setIsArchiveOpen(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!activeCourseId || !pendingRestoreStatus) return;

    const toastId = toast.loading("Restoring archived course...");

    try {
      setIsSaving(true);

      const restoredCourse = await restoreArchivedCourse(activeCourseId);

      setCourse(restoredCourse);
      setStatus(
        (restoredCourse.status || pendingRestoreStatus) as CourseStatus,
      );

      await refreshCourse(activeCourseId);

      toast.success("Archived course restored successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
      setIsRestoreOpen(false);
      setPendingRestoreStatus(null);
    }
  };

  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm text-black/60">
          Courses › <span className="font-semibold text-[#006B3F]">Setup</span>
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#202420]">{pageTitle}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <CourseDetailsCard
            title={title}
            subtitle={subtitle}
            description={description}
            disabled={isLoading || isSaving}
            onTitleChange={setTitle}
            onSubtitleChange={setSubtitle}
            onDescriptionChange={setDescription}
          />

          <SyllabusBuilderCard courseId={activeCourseId} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="ghost"
              size="lg"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="text-[#006B3F] !bg-[#f5f1f1]"
            >
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>

            <Button size="lg" disabled={isSaving} onClick={handlePublish}>
              {isSaving ? "Publishing..." : "Publish Course"}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            disabled={isSaving || isCheckingDelete}
            onClick={handleDeleteClick}
            className="text-[#D00000] !bg-[#FFE1E1]"
          >
            {isCheckingDelete ? "Checking Delete Safety..." : "Delete Course"}
          </Button>
        </div>

        <aside className="space-y-6">
          <CourseProgressCard course={course} />

          <PricingAccessCard
            isFree={isFree}
            price={price}
            couponCode={couponCode}
            disabled={isLoading || isSaving}
            courseTitle={title}
            onIsFreeChange={setIsFree}
            onPriceChange={setPrice}
            onCouponCodeChange={setCouponCode}
          />

          <CourseStatusCard
            status={status}
            disabled={isLoading || isSaving}
            onStatusChange={handleStatusChange}
          />

          <FinalExaminationCard
            courseId={activeCourseId}
            courseTitle={title}
            disabled={isLoading || isSaving}
          />
        </aside>
      </div>

      <DeleteCourseDialog
        open={isDeleteOpen}
        courseTitle={title || "this course"}
        deleteSafety={deleteSafety}
        isDeleting={isSaving}
        onClose={() => setIsDeleteOpen(false)}
        onDeleteConfirm={handlePermanentDeleteConfirm}
      />

      <ArchiveCourseDialog
        open={isArchiveOpen}
        courseTitle={title || "this course"}
        isArchiving={isSaving}
        onClose={() => setIsArchiveOpen(false)}
        onConfirm={handleArchiveConfirm}
      />

      <RestoreCourseDialog
        open={isRestoreOpen}
        courseTitle={title || "this course"}
        targetStatus={pendingRestoreStatus}
        isRestoring={isSaving}
        onClose={() => {
          setIsRestoreOpen(false);
          setPendingRestoreStatus(null);
        }}
        onConfirm={handleRestoreConfirm}
      />

      <CoursePublishedDialog
        open={isPublishedOpen}
        courseTitle={title}
        onClose={() => setIsPublishedOpen(false)}
      />
    </section>
  );
};

export default CreateCourseForm;
