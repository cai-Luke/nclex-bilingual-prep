import assert from "node:assert/strict";
import { parseAppBuildInfo } from "../../lib/app-build-info";
import {
  AppUpdateChecker,
  attachAppUpdateTriggers,
  createBuildInfoUrl,
  formatAppBuildDiagnostic,
  isUpdateCheckEligible,
  type BuildInfoFetch,
} from "../../lib/app-update-core";
import { validateBuildArtifacts } from "../validate-build-info";

const current = { buildId: "abcdef123456", builtAt: "2026-07-18T12:00:00.000Z" };
const replacement = { buildId: "fedcba654321", builtAt: "2026-07-18T13:00:00.000Z" };

assert.deepEqual(parseAppBuildInfo(current), current);
assert.equal(parseAppBuildInfo({ buildId: "", builtAt: current.builtAt }), null);
assert.equal(parseAppBuildInfo({ buildId: current.buildId, builtAt: "not-a-date" }), null);
assert.equal(parseAppBuildInfo({ buildId: current.buildId, builtAt: "2026-02-30T12:00:00.000Z" }), null);
assert.equal(parseAppBuildInfo("malformed"), null);
assert.equal(formatAppBuildDiagnostic(null), "Unknown / 未知");
assert.match(formatAppBuildDiagnostic(current, "en-US"), /Jul 18, 2026 · abcdef1/);

assert.equal(isUpdateCheckEligible({ isProduction: true, protocol: "http:", currentBuild: current }), true);
assert.equal(isUpdateCheckEligible({ isProduction: true, protocol: "https:", currentBuild: current }), true);
assert.equal(isUpdateCheckEligible({ isProduction: true, protocol: "file:", currentBuild: current }), false);
assert.equal(isUpdateCheckEligible({ isProduction: false, protocol: "http:", currentBuild: current }), false);
assert.equal(isUpdateCheckEligible({ isProduction: true, protocol: "http:", currentBuild: null }), false);

const markerUrl = createBuildInfoUrl("https://example.test/nclex-bilingual-prep/index.html", 12345);
assert.equal(markerUrl.pathname, "/nclex-bilingual-prep/build-info.json");
assert.equal(markerUrl.searchParams.get("check"), "12345");

class FakeEventTarget {
  visibilityState = "hidden";
  private readonly listeners = new Map<string, Set<() => void>>();

  addEventListener(type: string, listener: () => void): void {
    const registered = this.listeners.get(type) ?? new Set();
    registered.add(listener);
    this.listeners.set(type, registered);
  }

  removeEventListener(type: string, listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type: string): void {
    this.listeners.get(type)?.forEach((listener) => listener());
  }
}

const fakeWindow = new FakeEventTarget();
const fakeDocument = new FakeEventTarget();
let triggerCount = 0;
const removeTriggers = attachAppUpdateTriggers({
  windowTarget: fakeWindow,
  documentTarget: fakeDocument,
  check: () => {
    triggerCount += 1;
  },
});
assert.equal(triggerCount, 1, "mount must trigger an immediate check");
fakeWindow.dispatch("focus");
assert.equal(triggerCount, 2, "window focus must trigger a check");
fakeDocument.dispatch("visibilitychange");
assert.equal(triggerCount, 2, "hidden visibility changes must not trigger a check");
fakeDocument.visibilityState = "visible";
fakeDocument.dispatch("visibilitychange");
assert.equal(triggerCount, 3, "returning to a visible tab must trigger a check");
removeTriggers();
fakeWindow.dispatch("focus");
fakeDocument.dispatch("visibilitychange");
assert.equal(triggerCount, 3, "cleanup must remove focus and visibility listeners");

const response = (body: unknown, ok = true) => ({ ok, json: async () => body });

let equalFetchCount = 0;
let equalRequestUrl: URL | undefined;
let equalRequestInit: Parameters<BuildInfoFetch>[1] | undefined;
const equalChecker = new AppUpdateChecker({
  currentBuild: current,
  isProduction: true,
  protocol: "https:",
  baseUri: "https://example.test/project/",
  now: () => 1_000,
  fetchBuildInfo: async (input, init) => {
    equalFetchCount += 1;
    equalRequestUrl = input;
    equalRequestInit = init;
    return response(current);
  },
});
assert.equal(await equalChecker.check(), false);
assert.equal(await equalChecker.check(), false);
assert.equal(equalFetchCount, 1, "rapid duplicate triggers must be throttled");
assert.equal(equalRequestUrl?.origin, "https://example.test");
assert.equal(equalRequestUrl?.pathname, "/project/build-info.json");
assert.equal(equalRequestInit?.cache, "no-store");
assert.equal(equalRequestInit?.credentials, "omit");

let replacementFetchCount = 0;
let latchedCount = 0;
let clock = 1_000;
const replacementChecker = new AppUpdateChecker({
  currentBuild: current,
  isProduction: true,
  protocol: "http:",
  baseUri: "http://127.0.0.1:4173/project/",
  now: () => clock,
  fetchBuildInfo: async () => {
    replacementFetchCount += 1;
    return response(replacementFetchCount === 1 ? replacement : current);
  },
  onUpdateAvailable: () => {
    latchedCount += 1;
  },
});
assert.equal(await replacementChecker.check(), true);
clock += 120_000;
assert.equal(await replacementChecker.check(), true);
assert.equal(replacementFetchCount, 1, "a latched update must stop later checks");
assert.equal(latchedCount, 1);

let resolveOverlap: ((value: ReturnType<typeof response>) => void) | undefined;
let overlapFetchCount = 0;
const overlapFetch: BuildInfoFetch = () => {
  overlapFetchCount += 1;
  return new Promise((resolvePromise) => {
    resolveOverlap = resolvePromise;
  });
};
const overlapChecker = new AppUpdateChecker({
  currentBuild: current,
  isProduction: true,
  protocol: "https:",
  baseUri: "https://example.test/project/",
  fetchBuildInfo: overlapFetch,
  now: () => 2_000,
});
const firstOverlap = overlapChecker.check();
const secondOverlap = overlapChecker.check();
assert.equal(overlapFetchCount, 1, "overlapping triggers must share one request");
resolveOverlap?.(response(current));
assert.equal(await firstOverlap, false);
assert.equal(await secondOverlap, false);

for (const eligibility of [
  { isProduction: true, protocol: "file:" },
  { isProduction: false, protocol: "https:" },
]) {
  let ineligibleFetchCount = 0;
  const checker = new AppUpdateChecker({
    currentBuild: current,
    ...eligibility,
    baseUri: "https://example.test/project/",
    fetchBuildInfo: async () => {
      ineligibleFetchCount += 1;
      return response(replacement);
    },
  });
  assert.equal(await checker.check(), false);
  assert.equal(ineligibleFetchCount, 0);
}

for (const body of [null, {}, { buildId: "", builtAt: current.builtAt }, { ...replacement, builtAt: "bad" }]) {
  const checker = new AppUpdateChecker({
    currentBuild: current,
    isProduction: true,
    protocol: "https:",
    baseUri: "https://example.test/project/",
    fetchBuildInfo: async () => response(body),
  });
  assert.equal(await checker.check(), false, "invalid remote markers must fail silently");
}

for (const fetchBuildInfo of [
  async () => response(replacement, false),
  async () => {
    throw new Error("offline");
  },
]) {
  const checker = new AppUpdateChecker({
    currentBuild: current,
    isProduction: true,
    protocol: "https:",
    baseUri: "https://example.test/project/",
    fetchBuildInfo,
  });
  assert.equal(await checker.check(), false, "network and non-OK failures must stay silent");
}

const validHtml = `<html><head><meta name="app-build-id" content="${current.buildId}"><meta content="${current.builtAt}" name="app-built-at"></head></html>`;
assert.doesNotThrow(() => validateBuildArtifacts(validHtml, JSON.stringify(current)));
assert.throws(() => validateBuildArtifacts(validHtml, "{"), /malformed JSON/);
assert.throws(() => validateBuildArtifacts("<html></html>", JSON.stringify(current)), /missing valid/);
assert.throws(() => validateBuildArtifacts(validHtml, JSON.stringify(replacement)), /build IDs do not match/);
assert.throws(
  () => validateBuildArtifacts(validHtml, JSON.stringify({ ...current, builtAt: "invalid" })),
  /invalid build identity/,
);
assert.throws(
  () => validateBuildArtifacts(validHtml, JSON.stringify({ ...current, builtAt: replacement.builtAt })),
  /timestamps do not match/,
);

console.log("app update tests passed");
