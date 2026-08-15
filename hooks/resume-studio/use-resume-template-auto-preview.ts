"use client";

import { useEffect, useRef } from "react";

interface UseResumeTemplateAutoPreviewOptions {
  enabled: boolean;
  fingerprint: string;
  blocked?: boolean;
  delayMs?: number;
  onPreview: () => Promise<void> | void;
}

export const useResumeTemplateAutoPreview = ({
  enabled,
  fingerprint,
  blocked = false,
  delayMs = 1200,
  onPreview,
}: UseResumeTemplateAutoPreviewOptions) => {
  const onPreviewRef = useRef(onPreview);
  const lastRequestedFingerprintRef = useRef("");

  useEffect(() => {
    onPreviewRef.current = onPreview;
  }, [onPreview]);

  useEffect(() => {
    if (!enabled || blocked || !fingerprint) return;
    if (lastRequestedFingerprintRef.current === fingerprint) return;

    const timeout = window.setTimeout(() => {
      lastRequestedFingerprintRef.current = fingerprint;
      void onPreviewRef.current();
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [blocked, delayMs, enabled, fingerprint]);
};
