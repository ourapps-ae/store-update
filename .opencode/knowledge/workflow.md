# Local workflow

Local only: no commits, pushes, remote changes or publishing without George's say-so. Licence wording remains deferred.

Commands from the package root: `node --test tests/web.test.ts`, `python3 tests/native.py apple`, `node --test tests/regression.test.ts`, `python3 tests/native.py android` (kotlinc is not installed here, so the Android check does not run).
Review a fetched archive: `python3 -m aepm review <digest> --store STORE --policy POLICY --trusted --allow-network`. Always `-B`.
