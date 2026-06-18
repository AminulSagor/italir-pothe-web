"use client";

import { ArrowLeft, BookOpen, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import {
  createCareerTrack,
  getCareerTrackDetails,
  getCareerTrackSummaryMetrics,
  getSkillBuilderFileReadUrl,
  updateCareerTrack,
  updateCareerTrackResources,
  uploadSkillBuilderPdf,
  uploadSkillBuilderVideo,
} from "@/service/skill-builder/skill-builder.service";
import type {
  SkillBuilderCareerTrack,
  SkillBuilderCareerTrackModule,
  UpdateCareerTrackPayload,
} from "@/types/skill-builder/skill-builder.type";

import CareerTrackFields from "./career-track-fields";
import CareerTrackResourceUploader from "./career-track-resource-uploader";
import ConnectedModulesPanel from "./connected-modules-panel";
import UnsavedChangesDialog from "./unsaved-changes-dialog";

const HUB_PATH = "/admin/skill-builder-manager";
const STUDIO_PATH = "/admin/skill-builder-manager/career-track-studio";
const MODULE_BUILDER_PATH =
  "/admin/skill-builder-manager/module-sentence-bank-builder";

const defaultForm = {
  title: "",
  subtitleBn: "",
  description: "",
  iconKey: "fork_knife",
  cardColor: "#FFEDE3",
  sortOrder: 1,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const getFileName = (
  file?: SkillBuilderCareerTrack["introVideoFile"] | null,
) => {
  return (
    file?.originalName || file?.fileName || file?.name || file?.title || ""
  );
};

const buildSnapshot = (params: {
  title: string;
  subtitleBn: string;
  description: string;
  iconKey: string;
  cardColor: string;
  sortOrder: number;
  introVideoFileId?: string;
  theoryResourceFileId?: string;
  introVideoFileName?: string;
  theoryPdfFileName?: string;
}) => {
  return JSON.stringify(params);
};

interface CareerTrackStudioContentProps {
  careerTrackIdFromUrl?: string;
  mode?: string;
}

export default function CareerTrackStudioContent({
  careerTrackIdFromUrl = "",
  mode = "",
}: CareerTrackStudioContentProps) {
  const router = useRouter();

  const isCreateMode = mode === "create" || !careerTrackIdFromUrl;

  const [careerTrackId, setCareerTrackId] = useState(careerTrackIdFromUrl);
  const [careerTrack, setCareerTrack] =
    useState<SkillBuilderCareerTrack | null>(null);

  const [title, setTitle] = useState(defaultForm.title);
  const [subtitleBn, setSubtitleBn] = useState(defaultForm.subtitleBn);
  const [description, setDescription] = useState(defaultForm.description);
  const [iconKey, setIconKey] = useState(defaultForm.iconKey);
  const [cardColor, setCardColor] = useState(defaultForm.cardColor);
  const [sortOrder, setSortOrder] = useState(defaultForm.sortOrder);

  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);
  const [theoryPdfFile, setTheoryPdfFile] = useState<File | null>(null);
  const [introVideoDisplayName, setIntroVideoDisplayName] = useState("");
  const [theoryPdfDisplayName, setTheoryPdfDisplayName] = useState("");

  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [pendingBack, setPendingBack] = useState(false);
  const [moduleRefreshKey, setModuleRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(!isCreateMode);
  const [isSaving, setIsSaving] = useState(false);

  const getActiveCareerTrackId = () => {
    return careerTrackId || careerTrack?.id || careerTrackIdFromUrl || "";
  };

  const getIntroVideoName = (track: SkillBuilderCareerTrack | null) => {
    return (
      getFileName(track?.introVideoFile) ||
      introVideoDisplayName ||
      (track?.introVideoFileId ? "Intro video attached" : "")
    );
  };

  const getTheoryPdfName = (track: SkillBuilderCareerTrack | null) => {
    return (
      getFileName(track?.theoryResourceFile) ||
      theoryPdfDisplayName ||
      (track?.theoryResourceFileId ? "Theory PDF attached" : "")
    );
  };

  const currentSnapshot = useMemo(
    () =>
      buildSnapshot({
        title,
        subtitleBn,
        description,
        iconKey,
        cardColor,
        sortOrder,
        introVideoFileId: careerTrack?.introVideoFileId,
        theoryResourceFileId: careerTrack?.theoryResourceFileId,
        introVideoFileName:
          introVideoFile?.name || getIntroVideoName(careerTrack),
        theoryPdfFileName: theoryPdfFile?.name || getTheoryPdfName(careerTrack),
      }),
    [
      title,
      subtitleBn,
      description,
      iconKey,
      cardColor,
      sortOrder,
      careerTrack,
      introVideoFile,
      theoryPdfFile,
      introVideoDisplayName,
      theoryPdfDisplayName,
    ],
  );

  const hasUnsavedChanges =
    savedSnapshot !== "" && currentSnapshot !== savedSnapshot;

  useEffect(() => {
    if (isCreateMode) {
      const snapshot = buildSnapshot({
        ...defaultForm,
        introVideoFileId: undefined,
        theoryResourceFileId: undefined,
        introVideoFileName: "",
        theoryPdfFileName: "",
      });

      setSavedSnapshot(snapshot);
      setIsLoading(false);
      return;
    }

    if (!careerTrackIdFromUrl) return;

    let isMounted = true;

    const loadCareerTrack = async () => {
      try {
        setIsLoading(true);

        const details = await getCareerTrackDetails(careerTrackIdFromUrl);

        if (!isMounted) return;

        const loadedIntroVideoName =
          getFileName(details.introVideoFile) ||
          (details.introVideoFileId ? "Intro video attached" : "");

        const loadedTheoryPdfName =
          getFileName(details.theoryResourceFile) ||
          (details.theoryResourceFileId ? "Theory PDF attached" : "");

        setCareerTrack(details);
        setCareerTrackId(details.id);
        setTitle(details.title || "");
        setSubtitleBn(details.subtitleBn || "");
        setDescription(details.description || "");
        setIconKey(details.iconKey || defaultForm.iconKey);
        setCardColor(details.cardColor || defaultForm.cardColor);
        setSortOrder(details.sortOrder || 1);
        setIntroVideoDisplayName(loadedIntroVideoName);
        setTheoryPdfDisplayName(loadedTheoryPdfName);
        setIntroVideoFile(null);
        setTheoryPdfFile(null);

        setSavedSnapshot(
          buildSnapshot({
            title: details.title || "",
            subtitleBn: details.subtitleBn || "",
            description: details.description || "",
            iconKey: details.iconKey || defaultForm.iconKey,
            cardColor: details.cardColor || defaultForm.cardColor,
            sortOrder: details.sortOrder || 1,
            introVideoFileId: details.introVideoFileId,
            theoryResourceFileId: details.theoryResourceFileId,
            introVideoFileName: loadedIntroVideoName,
            theoryPdfFileName: loadedTheoryPdfName,
          }),
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCareerTrack();

    return () => {
      isMounted = false;
    };
  }, [careerTrackIdFromUrl, isCreateMode]);

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

    router.push(HUB_PATH);
  };

  const handleConfirmBack = () => {
    setPendingBack(false);
    router.push(HUB_PATH);
  };

  const validateBeforeSave = () => {
    if (!title.trim()) {
      toast.error("Career track title is required.");
      return false;
    }

    if (isCreateMode && !introVideoFile) {
      toast.error("Intro video is required before creating a career track.");
      return false;
    }

    if (isCreateMode && !theoryPdfFile) {
      toast.error("Theory PDF is required before creating a career track.");
      return false;
    }

    return true;
  };

  const handleViewFile = async (fileId?: string | null) => {
    if (!fileId) {
      toast.error("No file is attached.");
      return;
    }

    try {
      const fileUrl = await getSkillBuilderFileReadUrl(fileId);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSaveTrack = async () => {
    if (!validateBeforeSave()) return;

    try {
      setIsSaving(true);

      const uploadedIntroVideoFileId = introVideoFile
        ? await uploadSkillBuilderVideo(introVideoFile)
        : undefined;

      const uploadedTheoryResourceFileId = theoryPdfFile
        ? await uploadSkillBuilderPdf(theoryPdfFile)
        : undefined;

      if (isCreateMode) {
        const metrics = await getCareerTrackSummaryMetrics();

        const createdTrack = await createCareerTrack({
          title: title.trim(),
          ...(subtitleBn.trim() ? { subtitleBn: subtitleBn.trim() } : {}),
          ...(description.trim() ? { description: description.trim() } : {}),
          iconKey,
          cardColor,
          introVideoFileId: uploadedIntroVideoFileId || "",
          theoryResourceFileId: uploadedTheoryResourceFileId || "",
          sortOrder:
            (metrics.totalCareerTracks || metrics.totalTracks || 0) + 1,
        });

        const savedIntroVideoName =
          getFileName(createdTrack.introVideoFile) ||
          introVideoFile?.name ||
          (createdTrack.introVideoFileId ? "Intro video attached" : "");

        const savedTheoryPdfName =
          getFileName(createdTrack.theoryResourceFile) ||
          theoryPdfFile?.name ||
          (createdTrack.theoryResourceFileId ? "Theory PDF attached" : "");

        setCareerTrack(createdTrack);
        setCareerTrackId(createdTrack.id);

        setTitle(createdTrack.title || title);
        setSubtitleBn(createdTrack.subtitleBn || subtitleBn);
        setDescription(createdTrack.description || description);
        setIconKey(createdTrack.iconKey || iconKey);
        setCardColor(createdTrack.cardColor || cardColor);
        setSortOrder(createdTrack.sortOrder || sortOrder);

        setIntroVideoDisplayName(savedIntroVideoName);
        setTheoryPdfDisplayName(savedTheoryPdfName);
        setIntroVideoFile(null);
        setTheoryPdfFile(null);

        setSavedSnapshot(
          buildSnapshot({
            title: createdTrack.title || title,
            subtitleBn: createdTrack.subtitleBn || subtitleBn,
            description: createdTrack.description || description,
            iconKey: createdTrack.iconKey || iconKey,
            cardColor: createdTrack.cardColor || cardColor,
            sortOrder: createdTrack.sortOrder || sortOrder,
            introVideoFileId: createdTrack.introVideoFileId,
            theoryResourceFileId: createdTrack.theoryResourceFileId,
            introVideoFileName: savedIntroVideoName,
            theoryPdfFileName: savedTheoryPdfName,
          }),
        );

        toast.success("Career track created. You can now attach modules.");

        router.replace(`${STUDIO_PATH}?careerTrackId=${createdTrack.id}`, {
          scroll: false,
        });

        return;
      }

      const activeCareerTrackId = getActiveCareerTrackId();

      if (!activeCareerTrackId) {
        throw new Error("Career track ID is missing.");
      }

      const updatePayload: UpdateCareerTrackPayload = {
        title: title.trim(),
        ...(subtitleBn.trim() ? { subtitleBn: subtitleBn.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        iconKey,
        cardColor,
        sortOrder,
      };

      const updatedTrack = await updateCareerTrack(
        activeCareerTrackId,
        updatePayload,
      );

      const shouldUpdateResources =
        Boolean(uploadedIntroVideoFileId) ||
        Boolean(uploadedTheoryResourceFileId);

      const resourceUpdatedTrack = shouldUpdateResources
        ? await updateCareerTrackResources(activeCareerTrackId, {
            ...(uploadedIntroVideoFileId
              ? { introVideoFileId: uploadedIntroVideoFileId }
              : {}),
            ...(uploadedTheoryResourceFileId
              ? { theoryResourceFileId: uploadedTheoryResourceFileId }
              : {}),
          })
        : updatedTrack;

      const savedIntroVideoName =
        getFileName(resourceUpdatedTrack.introVideoFile) ||
        introVideoFile?.name ||
        introVideoDisplayName ||
        (resourceUpdatedTrack.introVideoFileId ? "Intro video attached" : "");

      const savedTheoryPdfName =
        getFileName(resourceUpdatedTrack.theoryResourceFile) ||
        theoryPdfFile?.name ||
        theoryPdfDisplayName ||
        (resourceUpdatedTrack.theoryResourceFileId
          ? "Theory PDF attached"
          : "");

      setCareerTrack(resourceUpdatedTrack);
      setCareerTrackId(resourceUpdatedTrack.id);
      setTitle(resourceUpdatedTrack.title || title);
      setSubtitleBn(resourceUpdatedTrack.subtitleBn || subtitleBn);
      setDescription(resourceUpdatedTrack.description || description);
      setIconKey(resourceUpdatedTrack.iconKey || iconKey);
      setCardColor(resourceUpdatedTrack.cardColor || cardColor);
      setSortOrder(resourceUpdatedTrack.sortOrder || sortOrder);

      setIntroVideoDisplayName(savedIntroVideoName);
      setTheoryPdfDisplayName(savedTheoryPdfName);
      setIntroVideoFile(null);
      setTheoryPdfFile(null);

      setSavedSnapshot(
        buildSnapshot({
          title: resourceUpdatedTrack.title || title,
          subtitleBn: resourceUpdatedTrack.subtitleBn || subtitleBn,
          description: resourceUpdatedTrack.description || description,
          iconKey: resourceUpdatedTrack.iconKey || iconKey,
          cardColor: resourceUpdatedTrack.cardColor || cardColor,
          sortOrder: resourceUpdatedTrack.sortOrder || sortOrder,
          introVideoFileId: resourceUpdatedTrack.introVideoFileId,
          theoryResourceFileId: resourceUpdatedTrack.theoryResourceFileId,
          introVideoFileName: savedIntroVideoName,
          theoryPdfFileName: savedTheoryPdfName,
        }),
      );

      toast.success("Career track saved.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachModule = () => {
    const activeCareerTrackId = getActiveCareerTrackId();

    if (!activeCareerTrackId) {
      toast.error("Save the career track first.");
      return;
    }

    router.push(
      `${MODULE_BUILDER_PATH}?careerTrackId=${activeCareerTrackId}&mode=create`,
    );
  };

  const handleEditModule = (module: SkillBuilderCareerTrackModule) => {
    const activeCareerTrackId = getActiveCareerTrackId();

    if (!activeCareerTrackId) {
      toast.error("Save the career track first.");
      return;
    }

    router.push(
      `${MODULE_BUILDER_PATH}?careerTrackId=${activeCareerTrackId}&moduleId=${module.id}`,
    );
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBackRequest}
              className="mt-10 flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="size-5 text-[#006B3F]" />
            </button>

            <div>
              <p className="text-sm text-[#5F675F]">
                Course Management &gt;{" "}
                <span className="font-medium text-[#202420]">
                  Career Track Studio
                </span>
              </p>

              <h1 className="mt-5 text-3xl font-bold text-[#202420]">
                Master Video Settings
              </h1>

              <p className="mt-2 text-base text-[#5F675F]">
                Manage the master introduction video and supporting educational
                materials for this career track.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              disabled={isSaving}
              onClick={handleBackRequest}
            >
              DISCARD CHANGES
            </Button>

            <Button
              size="lg"
              disabled={isSaving || isLoading}
              onClick={handleSaveTrack}
            >
              {isSaving ? "SAVING..." : "SAVE TRACK"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[420px] animate-pulse rounded-3xl bg-[#EEF2EE]" />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <CareerTrackFields
                title={title}
                subtitleBn={subtitleBn}
                description={description}
                iconKey={iconKey}
                cardColor={cardColor}
                onTitleChange={setTitle}
                onSubtitleBnChange={setSubtitleBn}
                onDescriptionChange={setDescription}
                onIconKeyChange={setIconKey}
                onCardColorChange={setCardColor}
              />

              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E6F7EC]">
                    <MonitorPlay className="size-6 text-[#006B3F]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#202420]">
                      Master Introduction Video
                    </h2>

                    <p className="mt-1 text-sm text-[#5F675F]">
                      This video serves as the primary trailer for the career
                      track.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <CareerTrackResourceUploader
                    label="INTRO VIDEO"
                    type="video"
                    file={introVideoFile}
                    existingFileId={careerTrack?.introVideoFileId}
                    existingFileName={getIntroVideoName(careerTrack)}
                    onFileSelect={(file) => {
                      setIntroVideoFile(file);
                      setIntroVideoDisplayName(file.name);
                    }}
                    onClear={() => {
                      setIntroVideoFile(null);
                    }}
                    onView={() => handleViewFile(careerTrack?.introVideoFileId)}
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E6F7EC]">
                    <BookOpen className="size-6 text-[#006B3F]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#202420]">
                      Theory Book Resource
                    </h2>

                    <p className="mt-1 text-sm text-[#5F675F]">
                      Manage the primary theoretical companion for this track.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <CareerTrackResourceUploader
                    label="INSTRUCTIONAL RESOURCE"
                    type="pdf"
                    file={theoryPdfFile}
                    existingFileId={careerTrack?.theoryResourceFileId}
                    existingFileName={getTheoryPdfName(careerTrack)}
                    onFileSelect={(file) => {
                      setTheoryPdfFile(file);
                      setTheoryPdfDisplayName(file.name);
                    }}
                    onClear={() => {
                      setTheoryPdfFile(null);
                    }}
                    onView={() =>
                      handleViewFile(careerTrack?.theoryResourceFileId)
                    }
                  />
                </div>
              </div>
            </div>

            <ConnectedModulesPanel
              careerTrackId={getActiveCareerTrackId() || undefined}
              refreshKey={moduleRefreshKey}
              onAttachModule={handleAttachModule}
              onEditModule={handleEditModule}
            />
          </div>
        )}
      </section>

      <UnsavedChangesDialog
        open={pendingBack}
        onCancel={() => setPendingBack(false)}
        onOk={handleConfirmBack}
      />
    </>
  );
}
