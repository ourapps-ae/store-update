# store-update ownership

Repository: https://github.com/ourapps-ae/store-update.git (local only; nothing pushed). Package `ourapps-ae/store-update`, interface `ae/updates`, facility `updates`.
Standard: `/Users/george/Projects/com/my/.opencode/knowledge/component-standard.md`.

Code: `implementation/server/store.ts`, `implementation/web/update.ts`, `implementation/apple/Sources/Version.swift`, `implementation/android/src/main/java/ae/update/Version.kt`. `implementation/server/store.ts` is the invitation parser (complete opaque identifier, http and https, exactly one path segment after `/l/`) plus `updateAddress(settings)`.
Artefacts: `component.json`, `CONTRACT.md`, `INSTRUCTIONS.md`, `SOURCE.md`, `suitability.json` (library-only), `tools.lock.json`, `interfaces/updates.json`, `tests/` (including `tests/regression.test.ts` and `tests/fixtures/invitations.json`), `visual/`. No data is kept, so there is no `migration.json`.
