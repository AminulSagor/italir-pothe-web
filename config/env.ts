declare const process: { env: Record<string, string | undefined> };

export const service_URL =
  process.env.NEXT_PUBLIC_SERVICE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";
