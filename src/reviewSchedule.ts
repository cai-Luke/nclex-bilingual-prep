export const isDueForReview = (progress: { srsDueAt?: string } | undefined, now = new Date()) =>
  Boolean(progress?.srsDueAt && new Date(progress.srsDueAt).getTime() <= now.getTime());
