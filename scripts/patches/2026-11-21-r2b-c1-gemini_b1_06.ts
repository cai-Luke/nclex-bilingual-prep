/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_b1_06 (banks/gemini-canonical.json questions[181]), return 1 after checker HOLD.
 * P4 positional-reference rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from return-1 DECLARED-SURFACE.json sha256 14d9f130e6b9b3530b915c8dd729f1b17a27d91aa8ee0a0d91fcced5f8a6d693. Key, options and every other field unchanged.
 * Base item hash (json2) e8664a3efc9060c39099ddb6fd7e0c127bce4a313d459024ed2c83f75dc32ebe. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b1_06";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Appropriate management of AD involves removing the stimulus. Most common triggers are bladder distension, fecal impaction, or skin irritation. Antihypertensives are used if initial measures don't lower BP. Sitting the client up is the first step; lowering the HOB (E) would worsen hypertension-induced intracranial pressure.",
    after: "Appropriate management of AD involves removing the stimulus. Most common triggers are bladder distension, fecal impaction, or skin irritation, so the nurse checks the urinary drainage system for kinks, performs a digital rectal exam for impaction, and checks the skin for pressure sores or restrictive clothing. Antihypertensives are used if initial measures don't lower BP. Sitting the client up is the first step; lowering the HOB would worsen hypertension-induced intracranial pressure.",
    note: "R2 B-2R P4 reference rewrite, C1 return 1: 2 edit(s) covering 1 occurrence(s); kinds RESTATE_CONTENT_PARITY, DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "自主神经反射亢进的适当管理包括移除刺激物。最常见的诱因是膀胱膨胀（A）、粪便嵌塞（B）或皮肤刺激（D）。如果初始措施未能降低血压，则使用抗高血压药物（C）。让患者坐起是第一步；降低床头（E）会加重高血压引起的颅内压。",
    after: "自主神经反射亢进的适当管理包括移除刺激物。最常见的诱因是膀胱膨胀、粪便嵌塞或皮肤刺激，因此护士检查尿液引流系统是否有扭结、进行直肠指检以排查粪便嵌塞，并检查皮肤是否有压疮或束缚性衣物。如果初始措施未能降低血压，则使用抗高血压药物。让患者坐起是第一步；降低床头会加重高血压引起的颅内压。",
    note: "R2 B-2R P4 reference rewrite, C1 return 1: 3 edit(s) covering 5 occurrence(s); kinds RESTATE_CONTENT, DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
