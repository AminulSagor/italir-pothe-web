"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Dialog from "@/components/UI/dialogs/dialog";
import {
  createSurvivalSituation,
  getSurvivalSummaryMetrics,
  updateSurvivalSituation,
  uploadSurvivalPdf,
} from "@/service/survival-italian/survival-italian.service";
import type {
  SurvivalSituation,
  UpdateSurvivalSituationPayload,
} from "@/types/survival-italian/survival-italian.type";

import SituationForm from "../forms/situation-form";
import VisualIdentityPanel from "../forms/visual-identity-panel";

import PublishSuccessDialog from "./publish-success-dialog";

interface Props {
  open: boolean;
  situation: SurvivalSituation | null;
  onClose: () => void;
  onSaved: () => void;
}

const defaultIconKey = "bus";
const defaultCardColor = "#D9ECFF";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export default function EditSituationDialog({
  open,
  situation,
  onClose,
  onSaved,
}: Props) {
  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [selectedIconKey, setSelectedIconKey] = useState(defaultIconKey);
  const [selectedColor, setSelectedColor] = useState(defaultCardColor);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setSelectedIconKey(situation?.iconKey || defaultIconKey);
    setSelectedColor(situation?.cardColor || defaultCardColor);
    setError("");
  }, [open, situation]);

  const handlePublish = async (
    payload: UpdateSurvivalSituationPayload,
    uploadedPdf: File | null,
  ) => {
    try {
      setIsSaving(true);
      setError("");

      const metrics = situation ? null : await getSurvivalSummaryMetrics();

      const uploadedResourceFileId = uploadedPdf
        ? await uploadSurvivalPdf(uploadedPdf)
        : undefined;

      const finalPayload: UpdateSurvivalSituationPayload = {
        ...payload,
        iconKey: selectedIconKey,
        cardColor: selectedColor,
        ...(uploadedResourceFileId
          ? { resourceFileId: uploadedResourceFileId }
          : payload.resourceFileId !== undefined
            ? { resourceFileId: payload.resourceFileId }
            : {}),
        sortOrder: situation
          ? payload.sortOrder
          : (metrics?.totalSituations || 0) + 1,
      };

      const savedSituation = situation
        ? await updateSurvivalSituation(situation.id, finalPayload)
        : await createSurvivalSituation(finalPayload);

      setSuccessTitle(savedSituation.title || finalPayload.title);
      onSaved();
      onClose();
      setSuccessOpen(true);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        size="2xl"
        className="overflow-hidden p-0"
      >
        <div className="grid overflow-hidden md:grid-cols-[280px_1fr]">
          <VisualIdentityPanel
            selectedColor={selectedColor}
            selectedIconKey={selectedIconKey}
            onIconChange={setSelectedIconKey}
          />

          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-[#EEF2EE]"
            >
              <X className="size-5 text-[#4D574F]" />
            </button>

            <SituationForm
              situation={situation}
              selectedIconKey={selectedIconKey}
              selectedColor={selectedColor}
              error={error}
              isSaving={isSaving}
              onColorChange={setSelectedColor}
              onDiscard={onClose}
              onPublish={handlePublish}
            />
          </div>
        </div>
      </Dialog>

      <PublishSuccessDialog
        open={successOpen}
        situationName={successTitle}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}
