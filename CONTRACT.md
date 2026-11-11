# Store update component

## Purpose and facilities
Package `ourapps-ae/store-update`. `updates` derives store endpoints from injected invitations, fetches update descriptions and compares application version numbers on browser, Apple and Android clients.

## User inputs
Settings: `enabled` (boolean; default true) and `inviteAddress` (address; optional; the store invitation link, for example `https://ourapps.app/l/0123456789abcdef01234567`). The recipe also passes the installed version and a fetch function. No credentials, private links or fixed application addresses are bundled.

## Artefacts and dependencies
`component.json` maps every `implementation/` source into `components/store-update/`. Node 26.5 and Python 3.12 use standard libraries only. Native consumer checks use Swift 6.4 or Kotlin 2.2 and Java 26.0. `tools.lock.json` pins verification tools. Licence wording remains deferred.

## Provided interfaces
`interfaces/updates.json` defines `updates` (ae/updates) version 1.0.0 as an OpenRPC 1.3.2 document: one method per function (`updateUrlFor`, `updateAddress`, `isNewer`, `fetchUpdate`, `currentVersion`), tagged with the languages that provide it, with parameters and results as JSON Schema 2020-12. `server/store.ts` exports `updateUrlFor`. It accepts http and https addresses with exactly `/l/<one nonempty opaque segment>` (the invitation address), keeping the complete identifier including hyphens and underscores. Additional paths, encoded separators, credentials and malformed addresses return null; query and fragment suffixes are omitted from the derived address. `updateAddress(settings)` applies the two collected settings. `web/update.ts` exports `isNewer` and `fetchUpdate`. Native files provide `isNewer(_:than:)` and `ae.update.isNewer`. Numeric components compare with absent components zero-padded, suffixes discarded and malformed numeric components treated as zero. Current versions starting with `0.0.0` never update. This application-version comparator is distinct from the installer's exact package-version validation. Empty or separator-only version strings are outside the native input contract; Apple uses the reference split behaviour. Swift provides `currentVersion` from the application bundle.

## Required interfaces
The recipe supplies route wiring and update prompts. Fetch accepts an injected standard fetch function and returns only string `version` and `url` fields. Network failures, unsuccessful status, invalid data and invalid response shapes return null. Request completion, cancellation and retry policy remain with the injected fetch implementation; this helper adds no retries or timeout.

## Integration
See `INSTRUCTIONS.md` for selection and configuration and `suitability.json` for the library-only profile. `examples/consumer.ts` combines endpoint derivation, fetching and comparison without a game checkout. Include native source roots and import `ae.update.isNewer` on Android. Server routes call `updateUrlFor` and relay the response; callers decide whether to display or open an update link.

## Visual definition and connected examples
`visual/definition.json` maps its `updates` output to the provided interface. `visual/examples/connected.json` connects it to an illustrative application consumer. Both image formats and text descriptions are in `visual/output/`.

## Infrastructure
No service is deployed by this package. Runtime network access is through the caller's injected fetch implementation and configured address. Local tests use in-memory responses and no accounts. Provider interoperability and costs are unmeasured.

## Verification

Execution prerequisites are empty for these local library checks. Coverage is described here and in facilities; installed compilers are checked through the manifest's tools declaration. The invitation fixtures cover complete opaque identifiers, a synthetic 24-hex identifier, both address schemes, query/fragment removal and invalid-path rejection.
`node --test tests/web.test.ts` checks reference comparison fixtures, address derivation, offline and invalid responses and the independent consumer. `python3 tests/native.py apple` and `python3 tests/native.py android` compile native consumers. Device integration and live store operation require application-level verification.

## Scenarios and presentation
`0.6.10` follows `0.6.9`; suffix-only differences do not trigger updates. An offline store gives no update. The connected diagram shows update functions supplying application-owned prompts.

## Updates and removal
Patch updates replace files. The settings are `enabled` and `inviteAddress`. No version is published. Removal deletes owned sources and application imports; no application data is deleted.
