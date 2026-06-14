import type { InjectionRoute } from "./routes";

export interface InjectionSiteSpec {
  kind: "injection_site";
  route: InjectionRoute;
  caption?: {
    en: string;
    zh?: string;
  };
}
