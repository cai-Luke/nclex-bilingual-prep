/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_backfill_dc_wellness_07 (banks/gemini-canonical.json questions[791]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 45dd584cd03b964a4d27fca908e3b3f2856166ccce01942f44566d157691dc59. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_backfill_dc_wellness_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "According to the updated U.S. Preventive Services Task Force (USPSTF) guidelines, routine screening for colorectal cancer in average-risk individuals should begin at age 45 (1). This guideline was revised from age 50 in 2021 to address the rising incidence of early-onset colorectal cancer. For screening colonoscopy, if the initial results are normal and there are no high-risk factors (such as personal/family history of colorectal cancer or polyps), the recommended screening interval is every 10 years (2). Starting at age 40 (o1) is not recommended for average-risk individuals. Waiting until age 50 (o3) is outdated and misses the window for early detection. A 5-year interval (o1) is used for other modalities (e.g., flexible sigmoidoscopy or CT colonography) or for high-risk surveillance, but not for normal screening colonoscopy. A 15-year interval (o3) is too long to safely detect adenomas.",
    after: "According to the updated U.S. Preventive Services Task Force (USPSTF) guidelines, routine screening for colorectal cancer in average-risk individuals should begin at age 45 (1). This guideline was revised from age 50 in 2021 to address the rising incidence of early-onset colorectal cancer. For screening colonoscopy, if the initial results are normal and there are no high-risk factors (such as personal/family history of colorectal cancer or polyps), the recommended screening interval is every 10 years (2). Starting at age 40 is not recommended for average-risk individuals. Waiting until age 50 is outdated and misses the window for early detection. A 5-year interval is used for other modalities (e.g., flexible sigmoidoscopy or CT colonography) or for high-risk surveillance, but not for normal screening colonoscopy. A 15-year interval is too long to safely detect adenomas.",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "根据美国预防服务工作组 (USPSTF) 最新指南，对平均风险个体的常规结直肠癌筛查应从 45 岁开始 (1)。该指南于 2021 年从 50 岁进行了修订，以应对早发性结直肠癌发病率上升的问题。对于筛查性结肠镜检查，如果初始结果正常且无高危因素（例如结直肠癌或息肉的个人/家族史），推荐的筛查间隔为每 10 年一次 (2)。对于平均风险个体，不推荐从 40 岁 (o1) 开始。等到 50 岁 (o3) 已过时，会遗漏早期发现的窗口。5年间隔 (o1) 用于其他方式（例如乙状结肠镜检查或 CT 结肠造影）或高风险监测，但不适用于正常的筛查性结肠镜检查。15年间隔 (o3) 时间过长，无法安全地发现腺瘤。",
    after: "根据美国预防服务工作组 (USPSTF) 最新指南，对平均风险个体的常规结直肠癌筛查应从 45 岁开始 (1)。该指南于 2021 年从 50 岁进行了修订，以应对早发性结直肠癌发病率上升的问题。对于筛查性结肠镜检查，如果初始结果正常且无高危因素（例如结直肠癌或息肉的个人/家族史），推荐的筛查间隔为每 10 年一次 (2)。对于平均风险个体，不推荐从 40 岁开始。等到 50 岁已过时，会遗漏早期发现的窗口。5年间隔用于其他方式（例如乙状结肠镜检查或 CT 结肠造影）或高风险监测，但不适用于正常的筛查性结肠镜检查。15年间隔时间过长，无法安全地发现腺瘤。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
