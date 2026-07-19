import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseAppBuildInfo } from "../lib/app-build-info";

const readAttribute = (tag: string, name: string): string | null => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
};

const readMetaContent = (html: string, name: string): string | null => {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = metaTags.find((candidate) => readAttribute(candidate, "name") === name);
  return tag ? readAttribute(tag, "content") : null;
};

export const validateBuildArtifacts = (html: string, jsonText: string): void => {
  let json: unknown;
  try {
    json = JSON.parse(jsonText);
  } catch {
    throw new Error("dist/build-info.json is malformed JSON");
  }

  const markerBuild = parseAppBuildInfo(json);
  if (!markerBuild) throw new Error("dist/build-info.json contains invalid build identity");

  const embeddedBuild = parseAppBuildInfo({
    buildId: readMetaContent(html, "app-build-id"),
    builtAt: readMetaContent(html, "app-built-at"),
  });
  if (!embeddedBuild) throw new Error("dist/index.html is missing valid build identity metadata");
  if (embeddedBuild.buildId !== markerBuild.buildId) {
    throw new Error("dist build IDs do not match");
  }
  if (embeddedBuild.builtAt !== markerBuild.builtAt) {
    throw new Error("dist build timestamps do not match");
  }
};

export const validateBuildDistribution = async (distDirectory = join(process.cwd(), "dist")): Promise<void> => {
  const [html, jsonText] = await Promise.all([
    readFile(join(distDirectory, "index.html"), "utf8"),
    readFile(join(distDirectory, "build-info.json"), "utf8"),
  ]);
  validateBuildArtifacts(html, jsonText);
};

const entryPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (entryPath === import.meta.url) {
  await validateBuildDistribution();
  console.log(`build identity validated in ${dirname(fileURLToPath(import.meta.url))}/../dist`);
}
