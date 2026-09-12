# Phase D — curated pressure-injury photo reconnaissance

Terminal: **CAMPAIGN17_CURATED_IMAGE_RECON_READY**

Three asset-specific records are frozen in [candidates.json](candidates.json): one acquisition lead, one rights hold and one rejection. The source/rights trail is in [sources.json](sources.json), with repository input hashes in [scope.json](scope.json). This is reconnaissance only. No clinical image is committed, no production asset is downloaded, no permission request is sent, and no schema, renderer or learner-facing code is changed.

| Record | Exact asset | Disposition | Main finding |
|---|---|---|---|
| C17-IMAGE-01 | Herron/Cureus2021, Figure2A, pretreatment photo | ACQUIRE_CANDIDATE | Article-specific CC BY4.0 and explicit photograph-publication consent. The reviewed derivative shows a deep wound; original-resolution tissue recognition still requires a wound specialist. |
| C17-IMAGE-02 | NPIAP2016 staging poster, page2, unstageable row, right-column photo | HOLD_RIGHTS | Exact poster is copyrighted. Current policy requires a signed usage agreement; crop/master/redistribution scope and consent chain remain unresolved. |
| C17-IMAGE-03 | Commons `Decubitus_01.JPG`, revision1198928649 | REJECT | Exact CC BY-SA3.0 image license is present, but no patient-consent statement was located and the uploader's stage2 caption is insufficient for a clean staging exemplar. |

`ACQUIRE_CANDIDATE` means a candidate for the future acquisition/review lane, not approval to place an image in the app. No photo has passed independent clinical or production privacy review. These records do not provide a complete staging library or representative coverage of skin tones/sites.

Every record includes publisher, exact page/asset/master URLs, creator/credit, asset-specific rights evidence, attribution draft, derivative and commercial restrictions, file/resolution evidence, privacy/consent observations, a potential clinical construct, a visual-necessity test, bilingual alt-text draft, limitations and the precise next action. No rights conclusion relies on the hosting domain. Copyright permissions and patient consent are treated separately.

Inspection used temporary storage outside the worktree. The Commons original and both NPIAP PDF pages were visually inspected; Poppler reported embedded photo dimensions. The Cureus browser exposed the full article, figure caption, explicit publication-consent sentence and article-specific license on its Authors tab. Its displayed986×308 composite was exported through the browser and inspected. The linked lightbox reports3000×937, but direct retrieval returned403 and its screenshot was blank; the original is explicitly **unverified**. The future acquisition seat must inspect it before deciding whether panelA is a useful stage-discrimination stimulus. No tissue detail was synthesized or enhanced.

Access limitations are retained: several direct publisher/PMC requests returned403, a browser challenge,404 or520; normal browser access and the public Europe PMC XML supplied the indicated text/figure provenance. One optional PDF-object-position check lacked PyMuPDF, so the record reports the successful Poppler inventory and rendered layout rather than claiming that check passed.

Clinical limits matter: a photo cannot establish blanching, tenderness, warmth, fluctuance, palpable depth or a complete etiology. A future item must supply any required bedside context without stating the decisive visual finding or stage. The NPIAP labeled poster itself would reveal the answer; any isolated-photo derivative needs explicit rights. Accessibility should convey the same visible cues without substituting an answer label. No synthetic medical illustration or photograph is proposed.

Next action: Luke may commission the separate curated-image provenance/acquisition lane, beginning with independent wound-expert assessment of C17-IMAGE-01. If the NPIAP photo is prioritized, an explicitly authorized licensing request must name the exact photo, original resolution, crop/translation, offline redistribution, audience/commercial scope, credits and consent chain. This producer has not sent a request or accepted an agreement.
