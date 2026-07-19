import { useEffect, useMemo, useState } from "react";
import { parseAppBuildInfo, type AppBuildInfo } from "../lib/app-build-info";
import { AppUpdateChecker, attachAppUpdateTriggers } from "../lib/app-update-core";

type MetaDocument = {
  querySelector: <ElementType extends Element = Element>(selectors: string) => ElementType | null;
};

export const readCurrentBuildInfo = (documentLike: MetaDocument): AppBuildInfo | null =>
  parseAppBuildInfo({
    buildId: documentLike.querySelector<HTMLMetaElement>('meta[name="app-build-id"]')?.content,
    builtAt: documentLike.querySelector<HTMLMetaElement>('meta[name="app-built-at"]')?.content,
  });

export const useAppUpdate = (): {
  currentBuild: AppBuildInfo | null;
  updateAvailable: boolean;
} => {
  const currentBuild = useMemo(() => readCurrentBuildInfo(document), []);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checker = new AppUpdateChecker({
      currentBuild,
      isProduction: import.meta.env.PROD,
      protocol: window.location.protocol,
      baseUri: document.baseURI,
      fetchBuildInfo: (input, init) => fetch(input, init),
      onUpdateAvailable: () => setUpdateAvailable(true),
    });
    const check = () => {
      void checker.check();
    };
    const removeTriggers = attachAppUpdateTriggers({
      windowTarget: window,
      documentTarget: document,
      check,
    });

    return () => {
      removeTriggers();
      checker.dispose();
    };
  }, [currentBuild]);

  return { currentBuild, updateAvailable };
};
