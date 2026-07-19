export type AppBuildInfo = {
  buildId: string;
  builtAt: string;
};

const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const isValidBuildTimestamp = (value: string): boolean => {
  if (!ISO_TIMESTAMP_PATTERN.test(value)) return false;
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp) && new Date(timestamp).toISOString() === value;
};

export const parseAppBuildInfo = (value: unknown): AppBuildInfo | null => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.buildId !== "string" || typeof candidate.builtAt !== "string") return null;

  const buildId = candidate.buildId.trim();
  const builtAt = candidate.builtAt.trim();
  if (buildId.length === 0 || !isValidBuildTimestamp(builtAt)) return null;

  return { buildId, builtAt };
};

export const isDifferentBuild = (current: AppBuildInfo, remote: AppBuildInfo): boolean =>
  current.buildId !== remote.buildId;
