const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (value?: string | null): value is string => {
  return Boolean(value && UUID_REGEX.test(value));
};

export const assertValidUuid = (
  value?: string | null,
  label = "ID",
): string => {
  if (!isValidUuid(value)) {
    throw new Error(`${label} is missing or invalid.`);
  }

  return value;
};
