"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  createCareerTrackModule,
  createSkillBuilderSentence,
  deleteSkillBuilderSentence,
  getCareerTrackDetails,
  getCareerTrackModules,
  getSkillBuilderSentences,
  syncCareerTrack,
  updateCareerTrackModule,
  updateSkillBuilderSentence,
} from "@/service/skill-builder/skill-builder.service";
import type {
  SkillBuilderCareerTrack,
  SkillBuilderCareerTrackModule,
  SkillBuilderSentence,
  SkillBuilderSentenceListResponse,
  SkillBuilderSortOrder,
  UpdateCareerTrackModulePayload,
} from "@/types/skill-builder/skill-builder.type";

import AddSentenceButton from "./add-sentence-button";
import MagicAddWorkspaceCard from "./magic-add-workspace-card";
import ModuleNameCard from "./module-name-card";
import ModuleSentenceBankHeader from "./module-sentence-bank-header";
import SentenceBankSection from "./sentence-bank-section";
import UnsavedChangesDialog from "../../career-track-studio/_components/unsaved-changes-dialog";

const STUDIO_PATH = "/admin/skill-builder-manager/career-track-studio";
const MODULE_BANK_PATH =
  "/admin/skill-builder-manager/module-sentence-bank-builder";
const SENTENCES_PER_PAGE = 10;

const initialSentenceList: SkillBuilderSentenceListResponse = {
  items: [],
  page: 1,
  limit: SENTENCES_PER_PAGE,
  totalItems: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const buildSnapshot = (params: {
  moduleName: string;
  moduleSubtitleBn: string;
  bankRevision: number;
  lastSyncedKey: number;
}) => JSON.stringify(params);

const getSyncLabel = (careerTrack: SkillBuilderCareerTrack | null) => {
  const syncedAt = careerTrack?.lastSyncedAt || careerTrack?.syncedAt;

  if (!syncedAt) return "Not synced yet";

  const date = new Date(syncedAt);

  if (Number.isNaN(date.getTime())) return "Last sync unavailable";

  return `Last synced ${date.toLocaleString()}`;
};

const getNextModuleSortOrder = (modules: SkillBuilderCareerTrackModule[]) => {
  if (modules.length === 0) return 1;

  return Math.max(...modules.map((module) => module.sortOrder || 0)) + 1;
};

export default function ModuleSentenceBankContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const careerTrackId = searchParams.get("careerTrackId") || "";
  const moduleIdFromUrl = searchParams.get("moduleId") || "";
  const isCreateMode = searchParams.get("mode") === "create";

  const [careerTrack, setCareerTrack] =
    useState<SkillBuilderCareerTrack | null>(null);
  const [moduleId, setModuleId] = useState(moduleIdFromUrl);
  const [moduleName, setModuleName] = useState("");
  const [moduleSubtitleBn, setModuleSubtitleBn] = useState("");
  const [moduleSortOrder, setModuleSortOrder] = useState(1);

  const [sentenceList, setSentenceList] =
    useState<SkillBuilderSentenceListResponse>(initialSentenceList);
  const [sentencePage, setSentencePage] = useState(1);
  const [sentenceSearch, setSentenceSearch] = useState("");
  const [sentenceSortOrder, setSentenceSortOrder] =
    useState<SkillBuilderSortOrder>("ASC");

  const [italianSentence, setItalianSentence] = useState("");
  const [bengaliTranslation, setBengaliTranslation] = useState("");
  const [selectedSentence, setSelectedSentence] =
    useState<SkillBuilderSentence | null>(null);

  const [bankRevision, setBankRevision] = useState(0);
  const [lastSyncedKey, setLastSyncedKey] = useState(0);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [pendingBack, setPendingBack] = useState(false);

  const [isLoadingModule, setIsLoadingModule] = useState(true);
  const [isLoadingSentences, setIsLoadingSentences] = useState(false);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [isAddingSentence, setIsAddingSentence] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const currentSnapshot = useMemo(
    () =>
      buildSnapshot({
        moduleName,
        moduleSubtitleBn,
        bankRevision,
        lastSyncedKey,
      }),
    [moduleName, moduleSubtitleBn, bankRevision, lastSyncedKey],
  );

  const hasUnsavedChanges =
    savedSnapshot !== "" && currentSnapshot !== savedSnapshot;

  const nextSentenceSortOrder =
    sentenceList.items.length > 0
      ? Math.max(
          ...sentenceList.items.map((sentence) => sentence.sortOrder || 0),
        ) + 1
      : 1;

  useEffect(() => {
    let isMounted = true;

    const loadCareerTrack = async () => {
      if (!careerTrackId) return;

      try {
        const details = await getCareerTrackDetails(careerTrackId);

        if (isMounted) {
          setCareerTrack(details);
        }
      } catch {
        if (isMounted) {
          setCareerTrack(null);
        }
      }
    };

    loadCareerTrack();

    return () => {
      isMounted = false;
    };
  }, [careerTrackId, lastSyncedKey]);

  useEffect(() => {
    let isMounted = true;

    const loadModuleFromConnectedModules = async () => {
      try {
        setIsLoadingModule(true);

        if (!careerTrackId) {
          throw new Error("Career track ID is missing.");
        }

        const modulesResponse = await getCareerTrackModules(careerTrackId, {
          page: 1,
          limit: 100,
        });

        if (!isMounted) return;

        if (isCreateMode) {
          setModuleId("");
          setModuleName("");
          setModuleSubtitleBn("");
          setModuleSortOrder(getNextModuleSortOrder(modulesResponse.items));
          setSentenceList(initialSentenceList);

          setSavedSnapshot(
            buildSnapshot({
              moduleName: "",
              moduleSubtitleBn: "",
              bankRevision: 0,
              lastSyncedKey: 0,
            }),
          );

          return;
        }

        const selectedModule = moduleIdFromUrl
          ? modulesResponse.items.find(
              (module) => module.id === moduleIdFromUrl,
            )
          : modulesResponse.items[0];

        if (!selectedModule) {
          setModuleId("");
          setModuleName("");
          setModuleSubtitleBn("");
          setModuleSortOrder(1);
          setSentenceList(initialSentenceList);

          setSavedSnapshot(
            buildSnapshot({
              moduleName: "",
              moduleSubtitleBn: "",
              bankRevision: 0,
              lastSyncedKey: 0,
            }),
          );

          return;
        }

        setModuleId(selectedModule.id);
        setModuleName(selectedModule.name || "");
        setModuleSubtitleBn(selectedModule.subtitleBn || "");
        setModuleSortOrder(selectedModule.sortOrder || 1);

        setSavedSnapshot(
          buildSnapshot({
            moduleName: selectedModule.name || "",
            moduleSubtitleBn: selectedModule.subtitleBn || "",
            bankRevision: 0,
            lastSyncedKey: 0,
          }),
        );

        if (!moduleIdFromUrl) {
          router.replace(
            `${MODULE_BANK_PATH}?careerTrackId=${careerTrackId}&moduleId=${selectedModule.id}`,
            {
              scroll: false,
            },
          );
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoadingModule(false);
        }
      }
    };

    loadModuleFromConnectedModules();

    return () => {
      isMounted = false;
    };
  }, [careerTrackId, moduleIdFromUrl, isCreateMode, router]);

  useEffect(() => {
    if (!moduleId) {
      setSentenceList(initialSentenceList);
      return;
    }

    let isMounted = true;

    const loadSentences = async () => {
      try {
        setIsLoadingSentences(true);

        const response = await getSkillBuilderSentences(moduleId, {
          page: sentencePage,
          limit: SENTENCES_PER_PAGE,
          search: sentenceSearch,
          sortBy: "sortOrder",
          sortOrder: sentenceSortOrder,
        });

        if (isMounted) {
          setSentenceList(response);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setSentenceList(initialSentenceList);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSentences(false);
        }
      }
    };

    loadSentences();

    return () => {
      isMounted = false;
    };
  }, [moduleId, sentencePage, sentenceSearch, sentenceSortOrder]);

  useEffect(() => {
    setSentencePage(1);
  }, [sentenceSearch, sentenceSortOrder]);

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

  const handleBackRequest = () => {
    if (hasUnsavedChanges) {
      setPendingBack(true);
      return;
    }

    router.push(`${STUDIO_PATH}?careerTrackId=${careerTrackId}`);
  };

  const handleConfirmBack = () => {
    setPendingBack(false);
    router.push(`${STUDIO_PATH}?careerTrackId=${careerTrackId}`);
  };

  const reloadSentences = async (activeModuleId: string) => {
    const response = await getSkillBuilderSentences(activeModuleId, {
      page: sentencePage,
      limit: SENTENCES_PER_PAGE,
      search: sentenceSearch,
      sortBy: "sortOrder",
      sortOrder: sentenceSortOrder,
    });

    setSentenceList(response);
  };

  const saveModuleIfNeeded = async () => {
    if (!careerTrackId) {
      throw new Error("Career track ID is missing.");
    }

    if (!moduleName.trim()) {
      throw new Error("Module name is required.");
    }

    const payload: UpdateCareerTrackModulePayload = {
      name: moduleName.trim(),
      ...(moduleSubtitleBn.trim()
        ? { subtitleBn: moduleSubtitleBn.trim() }
        : {}),
      sortOrder: moduleSortOrder,
    };

    if (moduleId) {
      const updatedModule = await updateCareerTrackModule(moduleId, payload);

      setModuleName(updatedModule.name || "");
      setModuleSubtitleBn(updatedModule.subtitleBn || "");
      setModuleSortOrder(updatedModule.sortOrder || moduleSortOrder);

      return updatedModule.id;
    }

    const createdModule = await createCareerTrackModule(careerTrackId, payload);

    setModuleId(createdModule.id);
    setModuleName(createdModule.name || "");
    setModuleSubtitleBn(createdModule.subtitleBn || "");
    setModuleSortOrder(createdModule.sortOrder || moduleSortOrder);

    router.replace(
      `${MODULE_BANK_PATH}?careerTrackId=${careerTrackId}&moduleId=${createdModule.id}`,
      {
        scroll: false,
      },
    );

    return createdModule.id;
  };

  const handleConfirmSentence = async () => {
    if (!italianSentence.trim()) {
      toast.error("Italian sentence is required.");
      return;
    }

    try {
      setIsAddingSentence(true);

      const activeModuleId = await saveModuleIfNeeded();

      if (selectedSentence) {
        await updateSkillBuilderSentence(selectedSentence.id, {
          italianSentence: italianSentence.trim(),
          ...(bengaliTranslation.trim()
            ? { bengaliTranslation: bengaliTranslation.trim() }
            : {}),
          sortOrder: selectedSentence.sortOrder || nextSentenceSortOrder,
        });

        toast.success("Sentence updated.");
      } else {
        await createSkillBuilderSentence(activeModuleId, {
          italianSentence: italianSentence.trim(),
          ...(bengaliTranslation.trim()
            ? { bengaliTranslation: bengaliTranslation.trim() }
            : {}),
          sortOrder: nextSentenceSortOrder,
        });

        toast.success("Sentence added.");
      }

      setItalianSentence("");
      setBengaliTranslation("");
      setSelectedSentence(null);
      setBankRevision((currentValue) => currentValue + 1);

      await reloadSentences(activeModuleId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAddingSentence(false);
    }
  };

  const handleEditSentence = (sentence: SkillBuilderSentence) => {
    setSelectedSentence(sentence);
    setItalianSentence(sentence.italianSentence || "");
    setBengaliTranslation(sentence.bengaliTranslation || "");
  };

  const handleDeleteSentence = async (sentence: SkillBuilderSentence) => {
    try {
      await deleteSkillBuilderSentence(sentence.id);
      toast.success("Sentence deleted.");
      setBankRevision((currentValue) => currentValue + 1);

      if (moduleId) {
        await reloadSentences(moduleId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSaveAndSync = async () => {
    try {
      setIsSyncing(true);
      setIsSavingModule(true);

      const activeModuleId = await saveModuleIfNeeded();

      if (careerTrackId) {
        await syncCareerTrack(careerTrackId);
      }

      await reloadSentences(activeModuleId);

      const newSyncedKey = Date.now();
      setLastSyncedKey(newSyncedKey);

      setSavedSnapshot(
        buildSnapshot({
          moduleName,
          moduleSubtitleBn,
          bankRevision,
          lastSyncedKey: newSyncedKey,
        }),
      );

      toast.success("Module saved and synced.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSavingModule(false);
      setIsSyncing(false);
    }
  };

  const handleSentenceSortToggle = () => {
    setSentenceSortOrder((currentValue) =>
      currentValue === "ASC" ? "DESC" : "ASC",
    );
  };

  return (
    <>
      <div className="space-y-7">
        <ModuleSentenceBankHeader
          isSyncing={isSyncing}
          onBack={handleBackRequest}
          onSaveAndSync={handleSaveAndSync}
        />

        <ModuleNameCard
          moduleName={moduleName}
          moduleSubtitleBn={moduleSubtitleBn}
          disabled={isLoadingModule || isSavingModule}
          onModuleNameChange={setModuleName}
          onModuleSubtitleBnChange={setModuleSubtitleBn}
        />

        <AddSentenceButton />

        <MagicAddWorkspaceCard
          italianSentence={italianSentence}
          bengaliTranslation={bengaliTranslation}
          isSaving={isAddingSentence}
          selectedSentence={selectedSentence}
          onItalianSentenceChange={setItalianSentence}
          onBengaliTranslationChange={setBengaliTranslation}
          onConfirm={handleConfirmSentence}
          onCancelEdit={() => {
            setSelectedSentence(null);
            setItalianSentence("");
            setBengaliTranslation("");
          }}
        />

        <SentenceBankSection
          sentenceList={sentenceList}
          isLoading={isLoadingSentences}
          searchValue={sentenceSearch}
          syncLabel={getSyncLabel(careerTrack)}
          sortOrder={sentenceSortOrder}
          onSearchChange={setSentenceSearch}
          onSortToggle={handleSentenceSortToggle}
          onPageChange={setSentencePage}
          onEditSentence={handleEditSentence}
          onDeleteSentence={handleDeleteSentence}
        />
      </div>

      <UnsavedChangesDialog
        open={pendingBack}
        onCancel={() => setPendingBack(false)}
        onOk={handleConfirmBack}
      />
    </>
  );
}
