# Text-hygiene baseline summary

Advisory baseline. Counts are per rule x location class x bank file and are never pooled across banks or classes.
Each cell is `findings / distinct top-level items`. `n/a` marks a class the rule does not apply to.
A top-level item with no string `id` is counted as `(no id)`.

## Rules

| ID | Name | Applies to |
|---|---|---|
| TH1 | `invisible-char` | L-EN, L-ZH, L-ID, L-OTHER |
| TH2 | `nonstandard-space` | L-EN, L-ZH, L-ID, L-OTHER |
| TH3 | `id-non-ascii` | L-ID |
| TH4 | `fullwidth-alnum` | L-EN, L-ZH, L-ID, L-OTHER |
| TH5 | `en-cjk-punct` | L-EN |
| TH6 | `en-han` | L-EN |
| TH7 | `en-curly-double-quote` | L-EN |
| TH8 | `zh-ascii-punct` | L-ZH |
| TH9 | `zh-ascii-quote` | L-ZH |
| TH10 | `zh-ascii-paren` | L-ZH |
| TH11 | `zh-untranslated` | L-ZH |

## banks/burn-canonical.json

Top-level questions: 8. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/capnography-canonical.json

Top-level questions: 7. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/claude-canonical.json

Top-level questions: 96. S1 items differing: 1.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 1 / 1 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 62 / 5 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/device-canonical.json

Top-level questions: 8. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/gemini-canonical.json

Top-level questions: 874. S1 items differing: 29.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 2 / 1 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 46 / 28 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 1 / 1 | n/a | n/a |

## banks/gpt-canonical.json

Top-level questions: 797. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 352 / 56 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 6 / 3 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 4 / 4 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 7 / 6 | n/a | n/a |

## banks/hard-cases-canonical.json

Top-level questions: 66. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 347 / 9 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 58 / 5 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 62 / 9 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 1 / 1 | n/a | n/a |

## banks/io-canonical.json

Top-level questions: 8. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/lab-canonical.json

Top-level questions: 20. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/mar-canonical.json

Top-level questions: 8. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/medlabel-canonical.json

Top-level questions: 8. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/visual-canonical.json

Top-level questions: 57. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## banks/vitals-canonical.json

Top-level questions: 10. S1 items differing: 0.

| Rule | L-EN | L-ZH | L-ID | L-OTHER |
|---|---:|---:|---:|---:|
| TH1 `invisible-char` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH2 `nonstandard-space` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH3 `id-non-ascii` | n/a | n/a | 0 / 0 | n/a |
| TH4 `fullwidth-alnum` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| TH5 `en-cjk-punct` | 0 / 0 | n/a | n/a | n/a |
| TH6 `en-han` | 0 / 0 | n/a | n/a | n/a |
| TH7 `en-curly-double-quote` | 0 / 0 | n/a | n/a | n/a |
| TH8 `zh-ascii-punct` | n/a | 0 / 0 | n/a | n/a |
| TH9 `zh-ascii-quote` | n/a | 0 / 0 | n/a | n/a |
| TH10 `zh-ascii-paren` | n/a | 0 / 0 | n/a | n/a |
| TH11 `zh-untranslated` | n/a | 0 / 0 | n/a | n/a |

## S1 references shadow, per bank

Items whose Tier 1 references result changes when rationale strings are full-width-folded. Detail is in `s1-references-shadow.json`.

| Bank | Questions checked | Items differing | Added hazard entries | Added stale-key entries | Removed entries |
|---|---:|---:|---:|---:|---:|
| banks/burn-canonical.json | 8 | 0 | 0 | 0 | 0 |
| banks/capnography-canonical.json | 7 | 0 | 0 | 0 | 0 |
| banks/claude-canonical.json | 96 | 1 | 1 | 0 | 0 |
| banks/device-canonical.json | 8 | 0 | 0 | 0 | 0 |
| banks/gemini-canonical.json | 874 | 29 | 29 | 0 | 0 |
| banks/gpt-canonical.json | 797 | 0 | 0 | 0 | 0 |
| banks/hard-cases-canonical.json | 66 | 0 | 0 | 0 | 0 |
| banks/io-canonical.json | 8 | 0 | 0 | 0 | 0 |
| banks/lab-canonical.json | 20 | 0 | 0 | 0 | 0 |
| banks/mar-canonical.json | 8 | 0 | 0 | 0 | 0 |
| banks/medlabel-canonical.json | 8 | 0 | 0 | 0 | 0 |
| banks/visual-canonical.json | 57 | 0 | 0 | 0 | 0 |
| banks/vitals-canonical.json | 10 | 0 | 0 | 0 | 0 |
