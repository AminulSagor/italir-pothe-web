"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { inferResumeTemplateFieldSchema } from "@/service/resume-studio/resume-template.service";
import type {
  ResumeTemplateFieldInferenceResponse,
  ResumeTemplateFieldSchema,
} from "@/types/resume-studio/resume-template.types";

export type ResumeTemplateInferenceStatus =
  | "idle"
  | "detecting"
  | "synced"
  | "error";

interface UseResumeTemplateFieldInferenceOptions {
  html: string;
  fieldSchema: ResumeTemplateFieldSchema;
  enabled: boolean;
  onInferred: (fieldSchema: ResumeTemplateFieldSchema) => void;
  delayMs?: number;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Field detection failed.";

export const useResumeTemplateFieldInference = ({
  html,
  fieldSchema,
  enabled,
  onInferred,
  delayMs = 800,
}: UseResumeTemplateFieldInferenceOptions) => {
  const [status, setStatus] = useState<ResumeTemplateInferenceStatus>("idle");
  const [result, setResult] =
    useState<ResumeTemplateFieldInferenceResponse | null>(null);
  const [error, setError] = useState("");

  const htmlRef = useRef(html);
  const fieldSchemaRef = useRef(fieldSchema);
  const onInferredRef = useRef(onInferred);
  const lastInferredHtmlRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    htmlRef.current = html;
  }, [html]);

  useEffect(() => {
    fieldSchemaRef.current = fieldSchema;
  }, [fieldSchema]);

  useEffect(() => {
    onInferredRef.current = onInferred;
  }, [onInferred]);

  const runInference = useCallback(
    async (options?: {
      force?: boolean;
      throwOnError?: boolean;
    }): Promise<ResumeTemplateFieldInferenceResponse | null> => {
      const htmlSnapshot = htmlRef.current;

      if (!htmlSnapshot.trim()) {
        return null;
      }

      if (!options?.force && lastInferredHtmlRef.current === htmlSnapshot) {
        return null;
      }

      const requestId = ++requestIdRef.current;
      setStatus("detecting");
      setError("");

      try {
        const response = await inferResumeTemplateFieldSchema({
          html: htmlSnapshot,
          currentFieldSchema: fieldSchemaRef.current,
        });

        // Ignore a stale response if the creator changed HTML while the request ran.
        if (requestId !== requestIdRef.current || htmlRef.current !== htmlSnapshot) {
          return null;
        }

        lastInferredHtmlRef.current = htmlSnapshot;
        setResult(response);
        setStatus("synced");
        onInferredRef.current(response.fieldSchema);

        return response;
      } catch (caught) {
        if (requestId === requestIdRef.current) {
          setStatus("error");
          setError(getErrorMessage(caught));
        }

        if (options?.throwOnError) {
          throw caught;
        }

        return null;
      }
    },
    [],
  );

  useEffect(() => {
    if (!enabled || !html.trim() || lastInferredHtmlRef.current === html) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void runInference();
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, enabled, html, runInference]);

  return {
    status,
    result,
    error,
    runInference,
  };
};
