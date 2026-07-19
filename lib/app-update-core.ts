import {
  isDifferentBuild,
  parseAppBuildInfo,
  type AppBuildInfo,
} from "./app-build-info";

export const APP_UPDATE_MINIMUM_INTERVAL_MS = 60_000;

type BuildInfoResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

export type BuildInfoFetch = (
  input: URL,
  init: { cache: "no-store"; credentials: "omit"; signal: AbortSignal },
) => Promise<BuildInfoResponse>;

type UpdateCheckEligibility = {
  isProduction: boolean;
  protocol: string;
  currentBuild: AppBuildInfo | null;
};

export const isUpdateCheckEligible = ({
  isProduction,
  protocol,
  currentBuild,
}: UpdateCheckEligibility): boolean =>
  isProduction && currentBuild !== null && (protocol === "http:" || protocol === "https:");

export const createBuildInfoUrl = (baseUri: string, cacheBust: number): URL => {
  const url = new URL("./build-info.json", baseUri);
  url.searchParams.set("check", String(cacheBust));
  return url;
};

export const formatAppBuildDiagnostic = (
  buildInfo: AppBuildInfo | null,
  locales?: Intl.LocalesArgument,
): string => {
  if (!buildInfo) return "Unknown / 未知";

  const date = new Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(buildInfo.builtAt));
  return `${date} · ${buildInfo.buildId.slice(0, 7)}`;
};

type UpdateTriggerTarget = {
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
};

type VisibilityTriggerTarget = UpdateTriggerTarget & {
  visibilityState: string;
};

export const attachAppUpdateTriggers = ({
  windowTarget,
  documentTarget,
  check,
}: {
  windowTarget: UpdateTriggerTarget;
  documentTarget: VisibilityTriggerTarget;
  check: () => unknown;
}): (() => void) => {
  const handleFocus = () => {
    void check();
  };
  const handleVisibilityChange = () => {
    if (documentTarget.visibilityState === "visible") void check();
  };

  void check();
  windowTarget.addEventListener("focus", handleFocus);
  documentTarget.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    windowTarget.removeEventListener("focus", handleFocus);
    documentTarget.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};

type AppUpdateCheckerOptions = {
  currentBuild: AppBuildInfo | null;
  isProduction: boolean;
  protocol: string;
  baseUri: string;
  fetchBuildInfo: BuildInfoFetch;
  now?: () => number;
  minimumIntervalMs?: number;
  onUpdateAvailable?: () => void;
};

export class AppUpdateChecker {
  private readonly options: AppUpdateCheckerOptions;
  private readonly now: () => number;
  private readonly minimumIntervalMs: number;
  private lastCheckStartedAt = Number.NEGATIVE_INFINITY;
  private inFlight: Promise<boolean> | null = null;
  private abortController: AbortController | null = null;
  private updateAvailable = false;
  private disposed = false;

  constructor(options: AppUpdateCheckerOptions) {
    this.options = options;
    this.now = options.now ?? Date.now;
    this.minimumIntervalMs = options.minimumIntervalMs ?? APP_UPDATE_MINIMUM_INTERVAL_MS;
  }

  check(): Promise<boolean> {
    if (this.disposed) return Promise.resolve(false);
    if (this.updateAvailable) return Promise.resolve(true);
    if (
      !isUpdateCheckEligible({
        isProduction: this.options.isProduction,
        protocol: this.options.protocol,
        currentBuild: this.options.currentBuild,
      })
    ) {
      return Promise.resolve(false);
    }
    if (this.inFlight) return this.inFlight;

    const checkStartedAt = this.now();
    if (checkStartedAt - this.lastCheckStartedAt < this.minimumIntervalMs) {
      return Promise.resolve(false);
    }

    this.lastCheckStartedAt = checkStartedAt;
    const abortController = new AbortController();
    this.abortController = abortController;
    const request = this.performCheck(checkStartedAt, abortController.signal).finally(() => {
      if (this.inFlight === request) this.inFlight = null;
      if (this.abortController === abortController) this.abortController = null;
    });
    this.inFlight = request;
    return request;
  }

  dispose(): void {
    this.disposed = true;
    this.abortController?.abort();
    this.abortController = null;
  }

  private async performCheck(cacheBust: number, signal: AbortSignal): Promise<boolean> {
    try {
      const response = await this.options.fetchBuildInfo(
        createBuildInfoUrl(this.options.baseUri, cacheBust),
        { cache: "no-store", credentials: "omit", signal },
      );
      if (!response.ok) return false;

      const remoteBuild = parseAppBuildInfo(await response.json());
      const currentBuild = this.options.currentBuild;
      if (this.disposed || !remoteBuild || !currentBuild || !isDifferentBuild(currentBuild, remoteBuild)) {
        return false;
      }

      this.updateAvailable = true;
      this.options.onUpdateAvailable?.();
      return true;
    } catch {
      return false;
    }
  }
}
