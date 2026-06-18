"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  createLesson,
  getLessonDetails,
  updateLesson,
  uploadLessonAudio,
  uploadLessonPdf,
  uploadLessonVideo,
} from "@/service/course-directory/lesson.service";
import type { CourseLessonDetails } from "@/types/course-directory/lesson.type";

import AccessControlCard from "./access-control-card";
import ExercisesCard from "./exercises-card";
import LessonActionPanel from "./lesson-action-panel";
import LessonEditHeader from "./lesson-edit-header";
import MediaOverviewCard from "./media-overview-card";
import TheoryResourcesCard from "./theory-resources-card";
import UnsavedLessonWarningDialog from "./unsaved-lesson-warning-dialog";
import { getCourseById } from "@/service/course-directory/course.service";
import AccessControlConfirmDialog from "./access-control-confirm-dialog";
import {
  createQuiz,
  getQuizzesByLesson,
} from "@/service/course-directory/quiz.service";

interface LessonFormState {
  title: string;
  slug: string;
  videoFileId: string;
  theoryText: string;
  theoryAudioFileId: string;
  bengaliTranslation: string;
  supplementaryMaterialFileId: string;
  isFree: boolean;
  sortOrder: number;
}

const emptyLessonForm: LessonFormState = {
  title: "",
  slug: "",
  videoFileId: "",
  theoryText: "",
  theoryAudioFileId: "",
  bengaliTranslation: "",
  supplementaryMaterialFileId: "",
  isFree: true,
  sortOrder: 1,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const createSnapshot = (form: LessonFormState) => JSON.stringify(form);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const formFromLesson = (lesson: CourseLessonDetails): LessonFormState => ({
  title: lesson.title || "",
  slug: lesson.slug || "",
  videoFileId: lesson.videoFileId || "",
  theoryText: lesson.theoryText || "",
  theoryAudioFileId: lesson.theoryAudioFileId || "",
  bengaliTranslation: lesson.bengaliTranslation || "",
  supplementaryMaterialFileId: lesson.supplementaryMaterialFileId || "",
  isFree: Boolean(lesson.isFree),
  sortOrder: lesson.sortOrder || 1,
});

export default function LessonEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId") || "";
  const chapterId = searchParams.get("chapterId") || "";
  const lessonIdFromUrl = searchParams.get("lessonId") || "";

  const [lessonId, setLessonId] = useState(lessonIdFromUrl);
  const [lesson, setLesson] = useState<CourseLessonDetails | null>(null);

  const [form, setForm] = useState<LessonFormState>(emptyLessonForm);
  const [savedForm, setSavedForm] = useState<LessonFormState>(emptyLessonForm);
  const [savedSnapshot, setSavedSnapshot] = useState(
    createSnapshot(emptyLessonForm),
  );

  const [isLoading, setIsLoading] = useState(Boolean(lessonIdFromUrl));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const [isAccessConfirmOpen, setIsAccessConfirmOpen] = useState(false);
  const [pendingAccessValue, setPendingAccessValue] = useState<boolean | null>(
    null,
  );

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState("");

  const [courseTitle, setCourseTitle] = useState("");

  const currentSnapshot = useMemo(() => createSnapshot(form), [form]);
  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;

  const [pendingNavigationAction, setPendingNavigationAction] = useState<
    (() => void | Promise<void>) | null
  >(null);
  const [isOpeningQuiz, setIsOpeningQuiz] = useState(false);

  useEffect(() => {
    setLessonId(lessonIdFromUrl);
  }, [lessonIdFromUrl]);

  useEffect(() => {
    if (!lessonIdFromUrl) {
      setLesson(null);
      setForm(emptyLessonForm);
      setSavedForm(emptyLessonForm);
      setSavedSnapshot(createSnapshot(emptyLessonForm));
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadLesson = async () => {
      try {
        setIsLoading(true);

        const response = await getLessonDetails(lessonIdFromUrl);

        if (!isMounted) return;

        const nextForm = formFromLesson(response);

        setLesson(response);
        setLessonId(response.id);
        setForm(nextForm);
        setSavedForm(nextForm);
        setSavedSnapshot(createSnapshot(nextForm));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonIdFromUrl]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!courseId) {
      setCourseTitle("");
      return;
    }

    let isMounted = true;

    const loadCourseTitle = async () => {
      try {
        const response = await getCourseById(courseId);

        if (!isMounted) return;

        setCourseTitle(response.title || "");
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setCourseTitle("");
        }
      }
    };

    loadCourseTitle();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const updateForm = <K extends keyof LessonFormState>(
    key: K,
    value: LessonFormState[K],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      title: value,
      slug: currentForm.slug || slugify(value),
    }));
  };

  const buildBackHref = () =>
    courseId
      ? `/admin/course-directory/syllabus-builder?courseId=${courseId}`
      : "/admin/course-directory";

  const buildCurrentLessonHref = (savedLesson: CourseLessonDetails) =>
    `/admin/course-directory/syllabus-builder/lesson-edit?courseId=${courseId}&chapterId=${savedLesson.chapterId}&lessonId=${savedLesson.id}`;

  const buildVocabularyHref = () =>
    `/admin/course-directory/syllabus-builder/lesson-edit/manage-vocabulary?courseId=${courseId}&chapterId=${chapterId}&lessonId=${lessonId}`;

  const buildQuizHref = () =>
    `/admin/course-directory/syllabus-builder/lesson-edit/quiz-builder?courseId=${courseId}&chapterId=${chapterId}&lessonId=${lessonId}`;

  const requestNavigation = (
    href: string,
    action?: () => void | Promise<void>,
  ) => {
    if (hasUnsavedChanges) {
      setPendingNavigationHref(href);
      setPendingNavigationAction(() => action || (() => router.push(href)));
      setIsWarningOpen(true);
      return;
    }

    if (action) {
      void action();
      return;
    }

    router.push(href);
  };

  const confirmNavigation = () => {
    setIsWarningOpen(false);

    if (pendingNavigationAction) {
      void pendingNavigationAction();
      setPendingNavigationAction(null);
      setPendingNavigationHref("");
      return;
    }

    if (pendingNavigationHref) {
      router.push(pendingNavigationHref);
    }
  };

  const handleManageQuiz = () => {
    if (!lessonId) {
      toast.error("Save the lesson before managing quiz.");
      return;
    }

    requestNavigation(buildQuizHref(), async () => {
      try {
        setIsOpeningQuiz(true);

        const quizzes = await getQuizzesByLesson(lessonId);
        let quiz = quizzes[0];

        if (!quiz) {
          quiz = await createQuiz(lessonId, {
            title: form.title.trim() || lesson?.title || "Lesson Quiz",
            description: "Basic quiz for greetings lesson.",
            sortOrder: 1,
            status: "draft",
          });

          toast.success("Quiz builder created.");
        }

        router.push(`${buildQuizHref()}&quizId=${quiz.id}`);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsOpeningQuiz(false);
      }
    });
  };

  const handleDiscardChanges = () => {
    setForm(savedForm);
    toast.success("Changes discarded.");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Lesson title is required.");
      return false;
    }

    if (!form.slug.trim() && !slugify(form.title)) {
      toast.error("Lesson slug is required.");
      return false;
    }

    if (!chapterId && !lessonId) {
      toast.error("Chapter ID is missing.");
      return false;
    }

    return true;
  };

  const handleSaveLesson = async () => {
    if (!validateForm()) return null;

    const toastId = toast.loading("Saving lesson...");

    try {
      setIsSaving(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        videoFileId: form.videoFileId || null,
        theoryText: form.theoryText.trim() || null,
        theoryAudioFileId: form.theoryAudioFileId || null,
        bengaliTranslation: form.bengaliTranslation.trim() || null,
        supplementaryMaterialFileId: form.supplementaryMaterialFileId || null,
        isFree: form.isFree,
        sortOrder: form.sortOrder,
      };

      const savedLesson = lessonId
        ? await updateLesson(lessonId, payload)
        : await createLesson(chapterId, payload);

      const nextForm = formFromLesson(savedLesson);

      setLesson(savedLesson);
      setLessonId(savedLesson.id);
      setForm(nextForm);
      setSavedForm(nextForm);
      setSavedSnapshot(createSnapshot(nextForm));

      if (!lessonId) {
        router.replace(buildCurrentLessonHref(savedLesson), { scroll: false });
      }

      toast.success("Lesson saved successfully.", {
        id: toastId,
      });

      return savedLesson;
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageVocabulary = () => {
    if (!lessonId) {
      toast.error("Save the lesson before managing vocabulary.");
      return;
    }

    requestNavigation(buildVocabularyHref());
  };

  const handleVideoSelect = async (file: File) => {
    try {
      setIsUploadingVideo(true);

      const fileId = await uploadLessonVideo(file);

      updateForm("videoFileId", fileId);
      toast.success("Video uploaded.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleAudioSelect = async (file: File) => {
    try {
      setIsUploadingAudio(true);

      const fileId = await uploadLessonAudio(file);

      updateForm("theoryAudioFileId", fileId);
      toast.success("Theory audio uploaded.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handlePdfSelect = async (file: File) => {
    try {
      setIsUploadingPdf(true);

      const fileId = await uploadLessonPdf(file);

      updateForm("supplementaryMaterialFileId", fileId);
      toast.success("Supplementary PDF uploaded.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleAccessControlRequest = (nextIsFree: boolean) => {
    if (nextIsFree === form.isFree) return;

    setPendingAccessValue(nextIsFree);
    setIsAccessConfirmOpen(true);
  };

  const handleCancelAccessControlChange = () => {
    setPendingAccessValue(null);
    setIsAccessConfirmOpen(false);
  };

  const handleConfirmAccessControlChange = () => {
    if (pendingAccessValue === null) return;

    updateForm("isFree", pendingAccessValue);
    setPendingAccessValue(null);
    setIsAccessConfirmOpen(false);
  };

  return (
    <>
      <section className="space-y-7">
        <LessonEditHeader
          courseTitle={courseTitle}
          lessonTitle={form.title}
          chapterTitle={lesson?.chapter?.title}
          isEditMode={Boolean(lessonId)}
          onBack={() => requestNavigation(buildBackHref())}
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <MediaOverviewCard
              title={form.title}
              videoFileId={form.videoFileId}
              disabled={isLoading || isSaving}
              isUploadingVideo={isUploadingVideo}
              onTitleChange={handleTitleChange}
              onVideoSelect={handleVideoSelect}
              onDeleteVideo={() => updateForm("videoFileId", "")}
            />

            <TheoryResourcesCard
              theoryText={form.theoryText}
              bengaliTranslation={form.bengaliTranslation}
              theoryAudioFileId={form.theoryAudioFileId}
              supplementaryMaterialFileId={form.supplementaryMaterialFileId}
              disabled={isLoading || isSaving}
              isUploadingAudio={isUploadingAudio}
              isUploadingPdf={isUploadingPdf}
              onTheoryTextChange={(value) => updateForm("theoryText", value)}
              onBengaliTranslationChange={(value) =>
                updateForm("bengaliTranslation", value)
              }
              onAudioSelect={handleAudioSelect}
              onPdfSelect={handlePdfSelect}
              onRemoveAudio={() => updateForm("theoryAudioFileId", "")}
              onRemovePdf={() => updateForm("supplementaryMaterialFileId", "")}
            />
          </div>

          <aside className="space-y-6">
            <AccessControlCard
              isFree={form.isFree}
              disabled={isLoading || isSaving}
              onChange={handleAccessControlRequest}
            />

            <ExercisesCard
              onManageVocabulary={handleManageVocabulary}
              onManageQuiz={handleManageQuiz}
            />

            <LessonActionPanel
              isSaving={isSaving}
              onSave={handleSaveLesson}
              onDiscard={handleDiscardChanges}
            />
          </aside>
        </div>
      </section>

      <UnsavedLessonWarningDialog
        open={isWarningOpen}
        onCancel={() => {
          setIsWarningOpen(false);
          setPendingNavigationHref("");
          setPendingNavigationAction(null);
        }}
        onOk={confirmNavigation}
      />

      <AccessControlConfirmDialog
        open={isAccessConfirmOpen}
        nextIsFree={pendingAccessValue ?? form.isFree}
        onCancel={handleCancelAccessControlChange}
        onOk={handleConfirmAccessControlChange}
      />
    </>
  );
}
