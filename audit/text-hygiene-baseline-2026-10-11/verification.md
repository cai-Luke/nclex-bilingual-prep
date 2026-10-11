# Text-hygiene baseline verification

- Branch: `claude/text-hygiene-audit-2026-10-11`
- HEAD: `926752ad6a0518e76ae34a194585f3d951e8c3d3`
- Dirty paths (excluding `audit/text-hygiene-baseline-2026-10-11/`): none
- Scope: top-level `banks/*.json` only; `banks/banks-raw/` is not scanned.

## Per-bank file-byte SHA-256

SHA-256 of the raw file bytes on disk. This is neither the campaign hash convention nor the bank/archive hash convention.

| Bank | Bytes | File-byte SHA-256 |
|---|---:|---|
| banks/burn-canonical.json | 35551 | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| banks/capnography-canonical.json | 31101 | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| banks/claude-canonical.json | 1173753 | `949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553` |
| banks/device-canonical.json | 37982 | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| banks/gemini-canonical.json | 3770076 | `e1c602e862b044577cc35278b510d95b0e4c5e18123dd322102f02759c96573a` |
| banks/gpt-canonical.json | 7044171 | `d908e244175285458dc2d1c77d0b5ac505fcda0c75f70be7b757d891bfc7b2a0` |
| banks/hard-cases-canonical.json | 2101472 | `c660e41367de8b7de73ccc4ab565b3f3ea94ce01f63fb0e66edc8814074750ba` |
| banks/io-canonical.json | 44756 | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| banks/lab-canonical.json | 115364 | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| banks/mar-canonical.json | 51056 | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| banks/medlabel-canonical.json | 31725 | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| banks/visual-canonical.json | 305002 | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| banks/vitals-canonical.json | 51848 | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |
