export const MAX_PREVIEW_SAMPLE_DATA_LENGTH = 150_000;

export const parseResumePreviewSampleData = (
  value: string,
): Record<string, unknown> | undefined => {
  const trimmed = value.trim();

  if (!trimmed) return undefined;

  if (trimmed.length > MAX_PREVIEW_SAMPLE_DATA_LENGTH) {
    throw new Error("Preview sample data cannot exceed 150,000 characters.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("Preview sample data must be valid JSON.");
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Preview sample data must be a JSON object.");
  }

  return parsed as Record<string, unknown>;
};

export const formatResumePreviewSampleData = (
  value: Record<string, unknown> | null | undefined,
): string => (value && Object.keys(value).length ? JSON.stringify(value, null, 2) : "");
