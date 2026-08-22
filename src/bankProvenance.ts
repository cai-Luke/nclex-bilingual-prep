import manifest from "../banks-provenance.json";

export type BankProvenanceEntry = {
  id: string;
  bankPath: string;
  firstSeenOrdinal: number;
  firstSeenDate: string;
};

export type BankProvenanceManifest = {
  generatedAt: string;
  inputGitSha: string;
  entries: BankProvenanceEntry[];
  undated: string[];
};

export const bankProvenance = manifest as BankProvenanceManifest;
