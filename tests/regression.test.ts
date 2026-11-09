import assert from "node:assert/strict";
import test from "node:test";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {readFileSync} from "node:fs";

const root = process.env.PACKAGE_ROOT ?? ".";
const {updateUrlFor} = await import(pathToFileURL(resolve(root, "implementation/server/store.ts")).href);

const fixtures = JSON.parse(readFileSync(new URL("fixtures/invitations.json", import.meta.url), "utf8"));

for (const group of fixtures.accepted) {
  test(group.name, () => {
    for (const [invitation, expected] of group.cases) assert.equal(updateUrlFor(invitation), expected, invitation);
  });
}

test("reject trailing paths, encoded separators, credentials and malformed addresses", () => {
  for (const invitation of fixtures.rejected) assert.equal(updateUrlFor(invitation), null, invitation);
  assert.equal(updateUrlFor(undefined), null);
});
