"use client";

import { Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import { deleteLesson } from "@/service/course-directory/lesson.service";
import {
  createCourseChapter,
  deleteCourseChapter,
  getChapterLessons,
  getCourseSyllabus,
  getCourseSyllabusSummary,
  reorderCourseSyllabus,
  updateCourseChapter,
} from "@/service/course-directory/syllabus.service";
import type {
  SyllabusChapter,
  SyllabusLesson,
} from "@/types/course-directory/syllabus.type";

import ChapterTitleTray from "./chapter-title-tray";
import DeleteChapterDialog from "./delete-chapter-dialog";
import DeleteLessonDialog from "./delete-lesson-dialog";
import SyllabusChapterCard from "./syllabus-chapter-card";
import SyllabusHeader from "./syllabus-header";
import SyllabusSummaryCard from "./syllabus-summary-card";
import { getCourseById } from "@/service/course-directory/course.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const sortBySortOrder = <T extends { sortOrder: number }>(items: T[]) =>
  [...items].sort((a, b) => a.sortOrder - b.sortOrder);

export default function SyllabusBuilderContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";

  const [chapters, setChapters] = useState<SyllabusChapter[]>([]);
  const [summary, setSummary] = useState({
    totalChapters: 0,
    totalLessons: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingStructure, setIsSavingStructure] = useState(false);
  const [isSavingChapter, setIsSavingChapter] = useState(false);

  const [isChapterTrayOpen, setIsChapterTrayOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<SyllabusChapter | null>(
    null,
  );
  const [chapterTitle, setChapterTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const [deletingChapter, setDeletingChapter] =
    useState<SyllabusChapter | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<SyllabusLesson | null>(
    null,
  );

  const [draggedChapterId, setDraggedChapterId] = useState("");
  const [draggedLesson, setDraggedLesson] = useState<{
    chapterId: string;
    lessonId: string;
  } | null>(null);

  const totalLessons = useMemo(
    () =>
      chapters.reduce(
        (total, chapter) =>
          total + (chapter.lessons?.length || chapter.totalLessons || 0),
        0,
      ),
    [chapters],
  );

  const loadSyllabus = async () => {
    if (!courseId) {
      setChapters([]);
      setSummary({ totalChapters: 0, totalLessons: 0 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [courseResponse, syllabusResponse, summaryResponse] =
        await Promise.all([
          getCourseById(courseId),
          getCourseSyllabus(courseId),
          getCourseSyllabusSummary(courseId),
        ]);

      setCourseTitle(courseResponse.title || "");

      const chaptersWithLessons = await Promise.all(
        sortBySortOrder(syllabusResponse.chapters).map(async (chapter) => {
          const lessonResponse = await getChapterLessons(chapter.id);

          return {
            ...chapter,
            lessons: sortBySortOrder(lessonResponse.lessons || []),
          };
        }),
      );

      setChapters(chaptersWithLessons);
      setSummary(summaryResponse.summary);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setChapters([]);
      setSummary({ totalChapters: 0, totalLessons: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabus();
  }, [courseId]);

  const openCreateChapterTray = () => {
    setEditingChapter(null);
    setChapterTitle("");
    setIsChapterTrayOpen(true);
  };

  const openEditChapterTray = (chapter: SyllabusChapter) => {
    setEditingChapter(chapter);
    setChapterTitle(chapter.title);
    setIsChapterTrayOpen(true);
  };

  const closeChapterTray = () => {
    setEditingChapter(null);
    setChapterTitle("");
    setIsChapterTrayOpen(false);
  };

  const handleSaveChapter = async () => {
    if (!courseId) {
      toast.error("Course ID is missing.");
      return;
    }

    if (!chapterTitle.trim()) {
      toast.error("Chapter title is required.");
      return;
    }

    try {
      setIsSavingChapter(true);

      if (editingChapter) {
        await updateCourseChapter(editingChapter.id, {
          title: chapterTitle.trim(),
          sortOrder: editingChapter.sortOrder,
          isPublished: editingChapter.isPublished,
        });

        toast.success("Chapter updated successfully.");
      } else {
        const nextSortOrder =
          chapters.length > 0
            ? Math.max(...chapters.map((chapter) => chapter.sortOrder)) + 1
            : 1;

        await createCourseChapter(courseId, {
          title: chapterTitle.trim(),
          sortOrder: nextSortOrder,
          isPublished: true,
        });

        toast.success("Chapter created successfully.");
      }

      closeChapterTray();
      await loadSyllabus();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSavingChapter(false);
    }
  };

  const handleDeleteChapter = async () => {
    if (!deletingChapter) return;

    try {
      await deleteCourseChapter(deletingChapter.id);
      toast.success("Chapter deleted successfully.");
      setDeletingChapter(null);
      await loadSyllabus();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;

    try {
      await deleteLesson(deletingLesson.id);
      toast.success("Lesson deleted successfully.");
      setDeletingLesson(null);
      await loadSyllabus();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleChapterDrop = (targetChapterId: string) => {
    if (!draggedChapterId || draggedChapterId === targetChapterId) return;

    const currentIndex = chapters.findIndex(
      (chapter) => chapter.id === draggedChapterId,
    );
    const targetIndex = chapters.findIndex(
      (chapter) => chapter.id === targetChapterId,
    );

    if (currentIndex < 0 || targetIndex < 0) return;

    const updatedChapters = [...chapters];
    const [movedChapter] = updatedChapters.splice(currentIndex, 1);

    updatedChapters.splice(targetIndex, 0, movedChapter);

    setChapters(
      updatedChapters.map((chapter, index) => ({
        ...chapter,
        sortOrder: index + 1,
      })),
    );
    setDraggedChapterId("");
  };

  const handleLessonDrop = (
    targetChapterId: string,
    targetLessonId: string,
  ) => {
    if (!draggedLesson || draggedLesson.chapterId !== targetChapterId) return;

    setChapters((currentChapters) =>
      currentChapters.map((chapter) => {
        if (chapter.id !== targetChapterId) return chapter;

        const currentIndex = chapter.lessons.findIndex(
          (lesson) => lesson.id === draggedLesson.lessonId,
        );
        const targetIndex = chapter.lessons.findIndex(
          (lesson) => lesson.id === targetLessonId,
        );

        if (currentIndex < 0 || targetIndex < 0) return chapter;

        const updatedLessons = [...chapter.lessons];
        const [movedLesson] = updatedLessons.splice(currentIndex, 1);

        updatedLessons.splice(targetIndex, 0, movedLesson);

        return {
          ...chapter,
          lessons: updatedLessons.map((lesson, index) => ({
            ...lesson,
            sortOrder: index + 1,
          })),
        };
      }),
    );

    setDraggedLesson(null);
  };

  const handleSaveSyllabusStructure = async () => {
    if (!courseId) {
      toast.error("Course ID is missing.");
      return;
    }

    const toastId = toast.loading("Saving syllabus structure...");

    try {
      setIsSavingStructure(true);

      await reorderCourseSyllabus(courseId, {
        chapters: chapters.map((chapter, chapterIndex) => ({
          chapterId: chapter.id,
          sortOrder: chapterIndex + 1,
          lessons: chapter.lessons.map((lesson, lessonIndex) => ({
            lessonId: lesson.id,
            sortOrder: lessonIndex + 1,
          })),
        })),
      });

      toast.success("Syllabus structure saved successfully.", {
        id: toastId,
      });

      await loadSyllabus();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSavingStructure(false);
    }
  };

  if (!courseId) {
    return (
      <main>
        <div className="rounded-3xl bg-white px-6 py-10 text-sm text-[#66736B]">
          Course ID is missing. Please open syllabus builder from Manage Course.
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="space-y-6">
        <SyllabusHeader courseTitle={courseTitle} />

        <SyllabusSummaryCard
          totalChapters={summary.totalChapters || chapters.length}
          totalLessons={summary.totalLessons || totalLessons}
          onAddChapter={openCreateChapterTray}
        />

        {isChapterTrayOpen ? (
          <ChapterTitleTray
            title={chapterTitle}
            isEditing={Boolean(editingChapter)}
            isSaving={isSavingChapter}
            onTitleChange={setChapterTitle}
            onCancel={closeChapterTray}
            onSave={handleSaveChapter}
          />
        ) : null}

        <div className="space-y-5">
          {isLoading ? (
            <div className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-[#66736B]">
              Loading syllabus...
            </div>
          ) : chapters.length > 0 ? (
            chapters.map((chapter, index) => (
              <SyllabusChapterCard
                key={chapter.id}
                courseId={courseId}
                chapter={chapter}
                chapterNumber={index + 1}
                onEditChapter={() => openEditChapterTray(chapter)}
                onDeleteChapter={() => setDeletingChapter(chapter)}
                onDeleteLesson={(lesson: SyllabusLesson) =>
                  setDeletingLesson(lesson)
                }
                onChapterDragStart={() => setDraggedChapterId(chapter.id)}
                onChapterDrop={() => handleChapterDrop(chapter.id)}
                onLessonDragStart={(lesson: SyllabusLesson) =>
                  setDraggedLesson({
                    chapterId: chapter.id,
                    lessonId: lesson.id,
                  })
                }
                onLessonDrop={(lesson: SyllabusLesson) =>
                  handleLessonDrop(chapter.id, lesson.id)
                }
              />
            ))
          ) : (
            <div className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-[#66736B]">
              No chapters found. Add a chapter to start building this syllabus.
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            disabled={isSavingStructure}
            className="w-full gap-2 shadow-lg sm:w-auto"
            onClick={handleSaveSyllabusStructure}
          >
            <Save className="size-4" />
            {isSavingStructure ? "Saving..." : "Save Syllabus Structure"}
          </Button>
        </div>
      </div>

      <DeleteChapterDialog
        open={Boolean(deletingChapter)}
        chapterTitle={deletingChapter?.title || ""}
        onClose={() => setDeletingChapter(null)}
        onConfirm={handleDeleteChapter}
      />

      <DeleteLessonDialog
        open={Boolean(deletingLesson)}
        lessonTitle={deletingLesson?.title || ""}
        onClose={() => setDeletingLesson(null)}
        onConfirm={handleDeleteLesson}
      />
    </main>
  );
}
