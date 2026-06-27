import type { InjectionRoute } from "./routes";

export type VesselRelation = "target" | "bystander";

export interface InjectionSiteSpec {
  kind: "injection_site";
  route: InjectionRoute;
  /**
   * Optional vessel rendered in the cross-section.
   * - "target": needle enters the vessel; valid only for intravenous.
   * - "bystander": vessel is visible but the needle must not intersect it.
   * - omitted: no vessel is rendered.
   */
  vessel?: VesselRelation;
  caption?: {
    en: string;
    zh?: string;
  };
}
