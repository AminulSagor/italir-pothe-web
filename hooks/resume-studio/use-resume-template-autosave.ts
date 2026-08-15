"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  saveResumeTemplateDraft,
  updateResumeTemplateMetadata,
} from "@/service/resume-studio/resume-template.service";
import type {
  ResumeTemplateAutosaveStatus,
  ResumeTemplateEditorState,
} from "@/types/resume-studio/resume-template.types";
import { validateTemplateEditorState } from "@/utils/resume-studio/resume-template-editor.utils";
import { parseResumePreviewSampleData } from "@/utils/resume-studio/resume-preview-sample-data.utils";

const LOCAL_DRAFT_PREFIX = "resume-studio:template-editor";
const LOCAL_SAVE_DELAY_MS = 400;
const SERVER_SAVE_DELAY_MS = 2500;

const getLocalKey = (templateId?: string | null) =>
  `${LOCAL_DRAFT_PREFIX}:${templateId ?? "new"}`;

export const readResumeTemplateLocalDraft = (
  templateId?: string | null,
): ResumeTemplateEditorState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(getLocalKey(templateId));

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as {
      state?: ResumeTemplateEditorState;
    };

    return parsed.state ?? null;
  } catch {
    return null;
  }
};

export const clearResumeTemplateLocalDraft = (
  templateId?: string | null,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getLocalKey(templateId));
};

interface UseResumeTemplateAutosaveOptions {
  templateId?: string | null;
  state: ResumeTemplateEditorState | null;
  enabled: boolean;
}

export const useResumeTemplateAutosave = ({
  templateId,
  state,
  enabled,
}: UseResumeTemplateAutosaveOptions) => {
  const [status, setStatus] = useState<ResumeTemplateAutosaveStatus>("idle");
  const lastServerFingerprint = useRef("");
  const initializedTemplateId = useRef<string | null>(null);

  const fingerprint = useMemo(
    () => (state ? JSON.stringify(state) : ""),
    [state],
  );

  useEffect(() => {
    if (!state || !enabled) {
      return;
    }

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          getLocalKey(templateId),
          JSON.stringify({
            savedAt: new Date().toISOString(),
            state,
          }),
        );
      } catch {
        // Local recovery is best effort. Server draft saving remains authoritative.
      }
    }, LOCAL_SAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [enabled, state, templateId]);

  useEffect(() => {
    if (!state || !enabled || !templateId || !fingerprint) {
      return;
    }

    if (initializedTemplateId.current !== templateId) {
      initializedTemplateId.current = templateId;
      lastServerFingerprint.current = fingerprint;
      setStatus("saved");
      return;
    }

    if (lastServerFingerprint.current === fingerprint) {
      return;
    }

    const validationErrors = validateTemplateEditorState(state, {
      isNew: false,
    });

    if (validationErrors.length) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      setStatus("saving");

      try {
        const sampleData = parseResumePreviewSampleData(state.sampleDataJson);

        await saveResumeTemplateDraft(templateId, {
          html: state.html,
          css: state.css,
          fieldSchema: state.fieldSchema,
          rendererConfig: state.rendererConfig,
          ...(sampleData ? { sampleData } : {}),
        });

        await updateResumeTemplateMetadata(templateId, {
          name: state.metadata.name.trim(),
          description: state.metadata.description.trim(),
          category: state.metadata.category.trim().toLowerCase(),
          isPremium: state.metadata.isPremium,
          sortOrder: state.metadata.sortOrder,
        });

        lastServerFingerprint.current = fingerprint;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, SERVER_SAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [enabled, fingerprint, state, templateId]);

  const markServerSaved = () => {
    lastServerFingerprint.current = fingerprint;
    setStatus("saved");
  };

  return {
    status,
    markServerSaved,
  };
};
