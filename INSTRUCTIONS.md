# Store updates instructions

Package `ourapps-ae/store-update` version `0.5.1`. It provides the `updates` interface (type `ae/updates`, version 1.0.0) and requires nothing.

## For the agent

- Select this component when the recipe's `updates` answer is yes (the application tells people when a newer store build exists).
- Connect the provided `updates` port to the server route that relays the store's latest-version document and to each client that shows an update prompt.
- Settings: `enabled` (boolean, default true) and `inviteAddress` (address, optional): the store invitation link from the recipe's `updates` answer. No accounts or keys are needed.
- Pass the application's current version string from the build (not a literal) into `isNewer`.

## For the developer

- Server: `components/store-update/server/store.ts` exports `updateUrlFor(inviteUrl)`; it turns an invitation address (http or https, exactly `/l/<identifier>`, the complete identifier kept) into the store's latest-version address, or returns null. `updateAddress({enabled, inviteAddress})` does the same from the collected settings and returns null when disabled.
- Web: `components/store-update/web/update.ts` exports `fetchUpdate(url, fetcher)` (returns `{version, url}` or null on any failure) and `isNewer(latest, current)`.
- Apple: `components/store-update/apple/Sources/Version.swift` has `isNewer(_:than:)` and `currentVersion` (from the application bundle).
- Android: `components/store-update/android/src/main/java/ae/update/Version.kt` has `ae.update.isNewer`; add the source root and import it.
- Comparison: numeric parts, missing parts count as zero, text after the first hyphen is ignored, malformed parts count as zero, a current version starting `0.0.0` never updates (development builds).
- You decide how to show the prompt and whether to open the link. Fetch retries and timeouts belong to the fetch function you inject.

## How to check

From the component directory:

- `node --test tests/web.test.ts` (required)
- `node --test tests/regression.test.ts` (required; invitation path regression)
- `python3 tests/native.py apple` (needs swiftc 6.4)
- `python3 tests/native.py android` (needs kotlinc 2.2 and java 26.0; not runnable where kotlinc is missing)
- `python3 -m aepm review <digest> --store STORE --policy POLICY --trusted --allow-network` checks an archive fetched with `python3 -m aepm fetch ourapps-ae/store-update@VERSION --store STORE --from https://ourapps.app` and runs its suites.

In the application, serve a store document with a higher version and confirm the prompt appears; serve a lower or equal version, an error status or invalid JSON and confirm no prompt appears.
