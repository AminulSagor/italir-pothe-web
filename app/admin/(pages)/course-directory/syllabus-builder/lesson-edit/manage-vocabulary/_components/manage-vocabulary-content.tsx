"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  createLessonVocabulary,
  deleteLessonVocabulary,
  getLessonVocabulary,
  updateLessonVocabulary,
} from "@/service/course-directory/lesson.service";
import type {
  LessonVocabulary,
  LessonVocabularyListResponse,
} from "@/types/course-directory/lesson.type";

import UnsavedLessonWarningDialog from "../../_components/unsaved-lesson-warning-dialog";
import VocabularyFormCard from "./vocabulary-form-card";
import VocabularyHeader from "./vocabulary-header";
import VocabularyTableCard from "./vocabulary-table-card";
import VocabularyToolbar from "./vocabulary-toolbar";

interface VocabularyFormState {
  italianWord: string;
  aiPronunciationFileId: string;
  englishMeaning: string;
  englishExample: string;
  sortOrder: number;
}

const VOCABULARY_LIMIT = 10;

const emptyVocabularyForm: VocabularyFormState = {
  italianWord: "",
  aiPronunciationFileId: "",
  englishMeaning: "",
  englishExample: "",
  sortOrder: 1,
};

const initialVocabularyList: LessonVocabularyListResponse = {
  items: [],
  page: 1,
  limit: VOCABULARY_LIMIT,
  totalItems: 0,
  totalPages: 1,
  search: null,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const createSnapshot = (form: VocabularyFormState) => JSON.stringify(form);

export default function ManageVocabularyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId") || "";
  const chapterId = searchParams.get("chapterId") || "";
  const lessonId = searchParams.get("lessonId") || "";

  const [vocabularyList, setVocabularyList] =
    useState<LessonVocabularyListResponse>(initialVocabularyList);
  const [form, setForm] = useState<VocabularyFormState>(emptyVocabularyForm);
  const [savedForm, setSavedForm] =
    useState<VocabularyFormState>(emptyVocabularyForm);
  const [editingVocabulary, setEditingVocabulary] =
    useState<LessonVocabulary | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState("");

  const hasUnsavedChanges = useMemo(
    () => createSnapshot(form) !== createSnapshot(savedForm),
    [form, savedForm],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const loadVocabulary = async () => {
    if (!lessonId) {
      setVocabularyList(initialVocabularyList);
      return;
    }

    try {
      setIsLoading(true);

      const response = await getLessonVocabulary(lessonId, {
        page,
        limit: VOCABULARY_LIMIT,
        search,
      });

      setVocabularyList(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setVocabularyList(initialVocabularyList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVocabulary();
  }, [lessonId, page, search]);

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

  const buildBackHref = () =>
    courseId
      ? `/admin/course-directory/syllabus-builder/lesson-edit?courseId=${courseId}&chapterId=${chapterId}&lessonId=${lessonId}`
      : "/admin/course-directory/syllabus-builder";

  const requestNavigation = (href: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigationHref(href);
      setIsWarningOpen(true);
      return;
    }

    router.push(href);
  };

  const confirmNavigation = () => {
    setIsWarningOpen(false);

    if (pendingNavigationHref) {
      router.push(pendingNavigationHref);
    }
  };

  const updateForm = <K extends keyof VocabularyFormState>(
    key: K,
    value: VocabularyFormState[K],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyVocabularyForm);
    setSavedForm(emptyVocabularyForm);
    setEditingVocabulary(null);
  };

  const handleEditVocabulary = (item: LessonVocabulary) => {
    const nextForm = {
      italianWord: item.italianWord || "",
      aiPronunciationFileId: item.aiPronunciationFileId || "",
      englishMeaning: item.englishMeaning || "",
      englishExample: item.englishExample || "",
      sortOrder: item.sortOrder || 1,
    };

    setEditingVocabulary(item);
    setForm(nextForm);
    setSavedForm(nextForm);
  };

  const validateForm = () => {
    if (!lessonId) {
      toast.error("Lesson ID is missing.");
      return false;
    }

    if (!form.italianWord.trim()) {
      toast.error("Italian word is required.");
      return false;
    }

    if (!form.englishMeaning.trim()) {
      toast.error("English meaning is required.");
      return false;
    }

    return true;
  };

  const handleSaveVocabulary = async () => {
    if (!validateForm()) return;

    const toastId = toast.loading(
      editingVocabulary ? "Updating vocabulary..." : "Saving vocabulary...",
    );

    try {
      setIsSaving(true);

      const payload = {
        italianWord: form.italianWord.trim(),
        aiPronunciationFileId: form.aiPronunciationFileId.trim() || null,
        englishMeaning: form.englishMeaning.trim(),
        englishExample: form.englishExample.trim() || null,
        sortOrder: form.sortOrder,
      };

      if (editingVocabulary) {
        await updateLessonVocabulary(editingVocabulary.id, payload);
      } else {
        await createLessonVocabulary(lessonId, payload);
      }

      toast.success(
        editingVocabulary
          ? "Vocabulary updated successfully."
          : "Vocabulary saved successfully.",
        { id: toastId },
      );

      resetForm();
      await loadVocabulary();
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVocabulary = async (item: LessonVocabulary) => {
    const toastId = toast.loading("Deleting vocabulary...");

    try {
      await deleteLessonVocabulary(item.id);

      toast.success("Vocabulary deleted successfully.", {
        id: toastId,
      });

      await loadVocabulary();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  if (!lessonId) {
    return (
      <div className="rounded-3xl bg-white px-6 py-10 text-sm text-[#66736B]">
        Lesson ID is missing. Please open vocabulary from a saved lesson.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <VocabularyHeader onBack={() => requestNavigation(buildBackHref())} />

        <VocabularyToolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          onAddNewWord={resetForm}
        />

        <VocabularyFormCard
          form={form}
          isEditing={Boolean(editingVocabulary)}
          isSaving={isSaving}
          onChange={updateForm}
          onSave={handleSaveVocabulary}
          onDiscard={resetForm}
        />

        <VocabularyTableCard
          words={vocabularyList.items}
          page={vocabularyList.page}
          limit={vocabularyList.limit}
          totalItems={vocabularyList.totalItems}
          totalPages={vocabularyList.totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
          onEdit={handleEditVocabulary}
          onDelete={handleDeleteVocabulary}
        />
      </div>

      <UnsavedLessonWarningDialog
        open={isWarningOpen}
        onCancel={() => {
          setIsWarningOpen(false);
          setPendingNavigationHref("");
        }}
        onOk={confirmNavigation}
      />
    </>
  );
}
