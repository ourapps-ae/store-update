# Source mapping

Reference revision: `19905b75dbea89fbfd424d67fe26c81aaed0e018` (frozen McInPoker, read with `git show` in `mcinpoker/`; the OurPoker recipe now imports this component). `implementation/server/store.ts` is the invitation parser with `updateAddress`.

| Implementation file | Frozen source and lines | Generalised | Left behind |
|---|---|---|---|
| `implementation/server/store.ts` (20) | `server/src/store.ts` 1-5 (`updateUrlFor`) | Takes an injected invitation address; no fixed host; parses the address (http and https, exactly one opaque segment after `/l/`, complete identifier kept) instead of the frozen prefix match; `updateAddress(settings)` is new | The `/update` relay route and `INVITE_URL` environment lookup (`server/src/index.ts` 61-67, recipe-owned) |
| `implementation/web/update.ts` (25) | `ios/McInPoker/Sources/Version.swift` 4-14 (comparator); relay shape from `server/src/index.ts` 61-67 and `server/src/contract.ts` 239-246 (`UpdateInfo`) | Browser comparator plus `fetchUpdate` with an injected fetch function; returns only string `version` and `url` | Store-specific fields (TestFlight link and version), prompt text, retry and timeout policy |
| `implementation/apple/Sources/Version.swift` (16) | `ios/McInPoker/Sources/Version.swift` 1-16 | Comment reworded | Nothing |
| `implementation/android/src/main/java/ae/update/Version.kt` (13) | `android/app/src/main/java/com/georgemcintyre/mcinpoker/Version.kt` 1-14 | Package `ae.update` | Nothing |

Details follow.

- `server/src/store.ts` -> `implementation/server/store.ts`: the frozen prefix matcher is replaced by a parser.
- `ios/McInPoker/Sources/Version.swift` -> `implementation/apple/Sources/Version.swift`: comparator and bundle version lookup.
- `android/app/src/main/java/com/georgemcintyre/mcinpoker/Version.kt` -> `implementation/android/src/main/java/ae/update/Version.kt`: comparator with generic package name.
- Native comparator -> `implementation/web/update.ts`: browser numeric/suffix comparison helper; `fetchUpdate` supplies the frozen injected-fetch contract corresponding to the reference `/update` relay and native update consumers.

`implementation/server/store.ts` parses http/https addresses and exactly one complete opaque invitation segment. `/l/Example1-other` returned the endpoint for `Example1` in the reference; this component preserves `Example1-other`. It rejects trailing paths, encoded separators, credentials and malformed addresses, and omits query/fragment suffixes. Tests use only synthetic addresses and identifiers.

Routing checked directly in `ourapps/worker/src/index.ts:52-81`: public link routes pass the complete path segment without an alphanumeric-only restriction. `routes/dev.ts:356` calls `randomId(12)`; `crypto.ts:16-19` emits 24 hexadecimal characters. Current identifier creation does not constrain the public routing contract to that alphabet. The component accepts both http and https.

`tests/regression.test.ts` and `tests/fixtures/invitations.json` check the invitation parser; `tests/web.test.ts` includes a test of `updateAddress`.
