"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import {
  clearResumeTemplateLocalDraft,
  useResumeTemplateAutosave,
} from "@/hooks/resume-studio/use-resume-template-autosave";
import { useResumeTemplateAutoPreview } from "@/hooks/resume-studio/use-resume-template-auto-preview";
import { useResumeTemplateFieldInference } from "@/hooks/resume-studio/use-resume-template-field-inference";
import {
  archiveResumeTemplate,
  createResumeTemplate,
  getResumeTemplate,
  getResumeTemplateContract,
  previewResumeTemplate,
  publishResumeTemplate,
  saveResumeTemplateDraft,
  updateResumeTemplateMetadata,
} from "@/service/resume-studio/resume-template.service";
import type {
  ResumeTemplate,
  ResumeTemplateAdminDetailResponse,
  ResumeTemplateContract,
  ResumeTemplateEditorMetadata,
  ResumeTemplateEditorState,
  ResumeTemplateFieldSchema,
  ResumeTemplateVersion,
} from "@/types/resume-studio/resume-template.types";
import {
  getPreferredEditableVersion,
  makeNewTemplateEditorState,
  validateTemplateEditorState,
} from "@/utils/resume-studio/resume-template-editor.utils";
import {
  formatResumePreviewSampleData,
  parseResumePreviewSampleData,
} from "@/utils/resume-studio/resume-preview-sample-data.utils";

import TemplateCodeSection from "./template-code-section";
import TemplateContractPanel from "./template-contract-panel";
import TemplateEditorHeader from "./template-editor-header";
import TemplateFieldSchemaSection from "./template-field-schema-section";
import TemplateMetadataSection from "./template-metadata-section";
import TemplatePreviewSection from "./template-preview-section";
import TemplateRendererSection from "./template-renderer-section";
import TemplateSampleDataSection from "./template-sample-data-section";
import TemplateVersionHistory from "./template-version-history";

interface ResumeTemplateEditorClientProps {
  templateId?: string;
}

const EMPTY_FIELD_SCHEMA: ResumeTemplateFieldSchema = {
  version: 1,
  sections: [],
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";

const makeEditorStateFromDetail = (
  detail: ResumeTemplateAdminDetailResponse,
): {
  state: ResumeTemplateEditorState;
  activeVersion: ResumeTemplateVersion;
} | null => {
  const version = getPreferredEditableVersion(detail.versions);

  if (!version) {
    return null;
  }

  return {
    state: {
      metadata: {
        name: detail.template.name,
        slug: detail.template.slug,
        description: detail.template.description ?? "",
        category: detail.template.category,
        isPremium: detail.template.isPremium,
        sortOrder: detail.template.sortOrder,
      },
      html: version.html,
      css: version.css,
      sampleDataJson: formatResumePreviewSampleData(version.sampleData),
      fieldSchema: version.fieldSchema,
      rendererConfig: version.rendererConfig,
    },
    activeVersion: version,
  };
};

export default function ResumeTemplateEditorClient({
  templateId,
}: ResumeTemplateEditorClientProps) {
  const router = useRouter();
  const isNew = !templateId;
  const [contract, setContract] = useState<ResumeTemplateContract | null>(null);
  const [state, setState] = useState<ResumeTemplateEditorState | null>(null);
  const [template, setTemplate] = useState<ResumeTemplate | null>(null);
  const [versions, setVersions] = useState<ResumeTemplateVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [persistedPreviewUrl, setPersistedPreviewUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [autoPreviewEnabled, setAutoPreviewEnabled] = useState(false);

  const actionBusy = isSaving || isPreviewing || isPublishing || isArchiving;

  const handleInferredFieldSchema = useCallback(
    (fieldSchema: ResumeTemplateFieldSchema) => {
      setState((current) =>
        current ? { ...current, fieldSchema } : current,
      );
    },
    [],
  );

  const fieldInference = useResumeTemplateFieldInference({
    html: state?.html ?? "",
    fieldSchema:
      state?.fieldSchema ?? contract?.defaultFieldSchema ?? EMPTY_FIELD_SCHEMA,
    enabled: Boolean(state?.html.trim() && contract) && !actionBusy,
    onInferred: handleInferredFieldSchema,
  });

  const busy = actionBusy || fieldInference.status === "detecting";

  const autosave = useResumeTemplateAutosave({
    templateId,
    state,
    enabled: Boolean(state && templateId) && !busy,
  });

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      if (isNew) {
        const templateContract = await getResumeTemplateContract();
        clearResumeTemplateLocalDraft(null);
        setContract(templateContract);
        setState(makeNewTemplateEditorState(templateContract.defaultFieldSchema));
        setTemplate(null);
        setVersions([]);
        setActiveVersionId(null);
        setPersistedPreviewUrl(null);
        setPreviewUrl(null);
        return;
      }

      const [templateContract, detail] = await Promise.all([
        getResumeTemplateContract(),
        getResumeTemplate(templateId),
      ]);

      const editable = makeEditorStateFromDetail(detail);

      if (!editable) {
        throw new Error("This template has no editable version.");
      }

      setContract(templateContract);
      setTemplate(detail.template);
      setVersions(detail.versions);
      setState(editable.state);
      setActiveVersionId(editable.activeVersion.id);
      setPersistedPreviewUrl(detail.previewPdfUrl);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [isNew, templateId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(
    () => () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    },
    [],
  );

  const validationErrors = useMemo(
    () =>
      state
        ? validateTemplateEditorState(state, {
            isNew,
          })
        : [],
    [isNew, state],
  );

  const sourcePayload = useCallback((current: ResumeTemplateEditorState) => {
    const sampleData = parseResumePreviewSampleData(current.sampleDataJson);

    return {
      html: current.html,
      css: current.css,
      fieldSchema: current.fieldSchema,
      rendererConfig: current.rendererConfig,
      ...(sampleData ? { sampleData } : {}),
    };
  }, []);

  const saveExistingDraft = useCallback(
    async (id: string, current: ResumeTemplateEditorState) => {
      await saveResumeTemplateDraft(id, sourcePayload(current));
      await updateResumeTemplateMetadata(id, {
        name: current.metadata.name.trim(),
        description: current.metadata.description.trim(),
        category: current.metadata.category.trim().toLowerCase(),
        isPremium: current.metadata.isPremium,
        sortOrder: current.metadata.sortOrder,
      });
    },
    [sourcePayload],
  );

  const prepareStateForSource = useCallback(
    async (current: ResumeTemplateEditorState) => {
      const inferred = await fieldInference.runInference({
        throwOnError: true,
      });

      return inferred
        ? { ...current, fieldSchema: inferred.fieldSchema }
        : current;
    },
    [fieldInference],
  );

  const saveDraft = useCallback(
    async (options?: { silent?: boolean }): Promise<string | null> => {
      if (!state) return null;

      const toastId = options?.silent
        ? undefined
        : toast.loading(isNew ? "Creating draft..." : "Saving draft...");

      setIsSaving(true);

      try {
        const preparedState = await prepareStateForSource(state);
        const errors = validateTemplateEditorState(preparedState, { isNew });

        if (errors.length) {
          if (toastId) toast.error(errors[0], { id: toastId });
          else if (!options?.silent) toast.error(errors[0]);
          return null;
        }

        if (isNew) {
          const response = await createResumeTemplate({
            name: preparedState.metadata.name.trim(),
            slug: preparedState.metadata.slug.trim(),
            description: preparedState.metadata.description.trim() || undefined,
            category: preparedState.metadata.category.trim().toLowerCase(),
            isPremium: preparedState.metadata.isPremium,
            sortOrder: preparedState.metadata.sortOrder,
            ...sourcePayload(preparedState),
          });

          clearResumeTemplateLocalDraft(null);
          autosave.markServerSaved();

          if (toastId) {
            toast.success("Draft created.", { id: toastId });
          }

          return response.template.id;
        }

        await saveExistingDraft(templateId, preparedState);
        autosave.markServerSaved();

        if (toastId) {
          toast.success("Draft saved.", { id: toastId });
        }

        const detail = await getResumeTemplate(templateId);
        const editable = makeEditorStateFromDetail(detail);
        setTemplate(detail.template);
        setVersions(detail.versions);
        setPersistedPreviewUrl(detail.previewPdfUrl);
        if (editable) setActiveVersionId(editable.activeVersion.id);

        return templateId;
      } catch (error) {
        if (toastId) {
          toast.error(getErrorMessage(error), { id: toastId });
        } else {
          toast.error(getErrorMessage(error));
        }
        return null;
      } finally {
        setIsSaving(false);
      }
    }, [
      autosave,
      isNew,
      prepareStateForSource,
      saveExistingDraft,
      sourcePayload,
      state,
      templateId,
    ],
  );

  const renderPreview = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!state || !state.html.trim()) return;

      const toastId = options?.silent
        ? undefined
        : toast.loading(
            "Detecting HTML fields and rendering backend PDF preview...",
          );
      setIsPreviewing(true);

      try {
        const preparedState = await prepareStateForSource(state);
        const errors = validateTemplateEditorState(preparedState, {
          isNew,
          requireMetadata: false,
        });

        if (errors.length) {
          throw new Error(errors[0]);
        }

        const file = await previewResumeTemplate(sourcePayload(preparedState));
        const objectUrl = URL.createObjectURL(file.blob);

        if (previewObjectUrlRef.current) {
          URL.revokeObjectURL(previewObjectUrlRef.current);
        }

        previewObjectUrlRef.current = objectUrl;
        setPreviewUrl(objectUrl);

        if (toastId) {
          toast.success("Fields detected and preview synced from backend.", {
            id: toastId,
          });
        }
      } catch (error) {
        if (toastId) {
          toast.error(getErrorMessage(error), { id: toastId });
        }
      } finally {
        setIsPreviewing(false);
      }
    },
    [isNew, prepareStateForSource, sourcePayload, state],
  );

  const handlePreview = useCallback(() => {
    void renderPreview();
  }, [renderPreview]);

  const autoPreviewFingerprint = useMemo(() => {
    if (!state?.html.trim()) return "";

    return JSON.stringify({
      html: state.html,
      css: state.css,
      sampleDataJson: state.sampleDataJson,
      fieldSchema: state.fieldSchema,
      rendererConfig: state.rendererConfig,
    });
  }, [state]);

  useResumeTemplateAutoPreview({
    enabled: autoPreviewEnabled,
    fingerprint: autoPreviewFingerprint,
    blocked: busy,
    onPreview: () => renderPreview({ silent: true }),
  });

  const handleSave = async () => {
    const id = await saveDraft();

    if (id && isNew) {
      router.replace(`/admin/cv-service/templates/${id}`);
    }
  };

  const handlePublish = async () => {
    if (!state) return;

    setIsPublishing(true);
    const toastId = toast.loading("Detecting fields, saving, and publishing template...");

    try {
      const preparedState = await prepareStateForSource(state);
      const errors = validateTemplateEditorState(preparedState, { isNew });
      if (errors.length) {
        throw new Error(errors[0]);
      }

      let id = templateId ?? null;

      if (isNew) {
        const created = await createResumeTemplate({
          name: preparedState.metadata.name.trim(),
          slug: preparedState.metadata.slug.trim(),
          description: preparedState.metadata.description.trim() || undefined,
          category: preparedState.metadata.category.trim().toLowerCase(),
          isPremium: preparedState.metadata.isPremium,
          sortOrder: preparedState.metadata.sortOrder,
          ...sourcePayload(preparedState),
        });
        id = created.template.id;
        clearResumeTemplateLocalDraft(null);
      } else {
        await saveExistingDraft(templateId, preparedState);
      }

      if (!id) {
        throw new Error("Template ID is missing.");
      }

      const detail = await publishResumeTemplate(id);
      autosave.markServerSaved();
      toast.success("CV template published.", { id: toastId });

      if (isNew) {
        router.replace(`/admin/cv-service/templates/${id}`);
        return;
      }

      const editable = makeEditorStateFromDetail(detail);
      setTemplate(detail.template);
      setVersions(detail.versions);
      setPersistedPreviewUrl(detail.previewPdfUrl);
      setPreviewUrl(null);
      if (editable) {
        setState(editable.state);
        setActiveVersionId(editable.activeVersion.id);
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleArchive = async () => {
    if (!templateId) return;

    setIsArchiving(true);
    const toastId = toast.loading("Archiving template...");

    try {
      const archived = await archiveResumeTemplate(templateId);
      setTemplate(archived);
      setArchiveDialogOpen(false);
      toast.success("Template archived.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleAutoDetect = async () => {
    const toastId = toast.loading("Detecting fields from HTML...");

    try {
      const result = await fieldInference.runInference({
        force: true,
        throwOnError: true,
      });

      if (!result) {
        toast.success("Field schema is already in sync with the HTML.", {
          id: toastId,
        });
        return;
      }

      const ignored = result.ignoredPlaceholders.length;
      toast.success(
        `Detected ${result.detectedFieldKeys.length} fields across ${result.detectedSectionKeys.length} sections${
          ignored ? `; ${ignored} placeholder${ignored === 1 ? "" : "s"} ignored` : ""
        }.`,
        { id: toastId },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  const handleMetadataChange = (metadata: ResumeTemplateEditorMetadata) => {
    setState((current) => (current ? { ...current, metadata } : current));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[560px] items-center justify-center rounded-3xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-[#006B3F]" />
          <p className="mt-3 text-sm text-black/50">Loading template studio…</p>
        </div>
      </div>
    );
  }

  if (loadError || !contract || !state) {
    return (
      <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
        <AlertTriangle className="mx-auto size-9 text-[#C56052]" />
        <h2 className="mt-4 text-lg font-bold text-[#202420]">
          Template editor could not be loaded
        </h2>
        <p className="mx-auto mt-2 max-w-[540px] text-sm text-black/50">
          {loadError || "The backend template contract is unavailable."}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => void load()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        <TemplateEditorHeader
          isNew={isNew}
          templateStatus={template?.status}
          autosaveStatus={autosave.status}
          isSaving={isSaving}
          isPreviewing={isPreviewing}
          isPublishing={isPublishing}
          isArchiving={isArchiving}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onArchive={templateId ? () => setArchiveDialogOpen(true) : undefined}
        />

        {validationErrors.length > 0 && (
          <div className="rounded-2xl border border-[#F2C9C2] bg-[#FFF7F5] px-5 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#B5473B]" />
              <div>
                <p className="text-sm font-bold text-[#8D352D]">
                  Template needs attention
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-[#7B4A44]">
                  {validationErrors.slice(0, 5).map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <TemplateMetadataSection
          value={state.metadata}
          isNew={isNew}
          onChange={handleMetadataChange}
        />

        <TemplateRendererSection
          value={state.rendererConfig}
          onChange={(rendererConfig) =>
            setState((current) =>
              current ? { ...current, rendererConfig } : current,
            )
          }
        />

        <TemplateContractPanel contract={contract} />

        <TemplateCodeSection
          html={state.html}
          css={state.css}
          onHtmlChange={(html) =>
            setState((current) => (current ? { ...current, html } : current))
          }
          onCssChange={(css) =>
            setState((current) => (current ? { ...current, css } : current))
          }
        />

        <TemplateSampleDataSection
          value={state.sampleDataJson}
          onChange={(sampleDataJson) =>
            setState((current) =>
              current ? { ...current, sampleDataJson } : current,
            )
          }
        />

        <TemplatePreviewSection
          previewUrl={previewUrl}
          persistedPreviewUrl={persistedPreviewUrl}
          onPreview={handlePreview}
          isPreviewing={isPreviewing}
          autoPreviewEnabled={autoPreviewEnabled}
          onAutoPreviewChange={setAutoPreviewEnabled}
        />

        <TemplateFieldSchemaSection
          value={state.fieldSchema}
          inferenceStatus={fieldInference.status}
          detectedFieldCount={fieldInference.result?.detectedFieldKeys.length}
          ignoredPlaceholders={fieldInference.result?.ignoredPlaceholders ?? []}
          inferenceError={fieldInference.error}
          onAutoDetect={handleAutoDetect}
          onChange={(fieldSchema) =>
            setState((current) =>
              current ? { ...current, fieldSchema } : current,
            )
          }
        />

        {!isNew && (
          <TemplateVersionHistory
            versions={versions}
            activeVersionId={activeVersionId}
          />
        )}
      </div>

      <ConfirmActionDialog
        open={archiveDialogOpen}
        title="Archive CV Template"
        description={`Archive “${template?.name ?? "this template"}”? Flutter will no longer receive it from the published template catalogue.`}
        confirmLabel="Archive Template"
        danger
        isSubmitting={isArchiving}
        onCancel={() => !isArchiving && setArchiveDialogOpen(false)}
        onConfirm={handleArchive}
      />
    </>
  );
}
