import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {isNewer, fetchUpdate} from "../implementation/web/update.ts";
import {updateUrlFor, updateAddress} from "../implementation/server/store.ts";
import {availableUpdate} from "../examples/consumer.ts";

const fixture = JSON.parse(readFileSync(new URL("fixtures/update.json", import.meta.url), "utf8"));
const versions = JSON.parse(readFileSync(new URL("fixtures/versions.json", import.meta.url), "utf8"));

test("reference numeric, suffix, padding and development comparisons", () => {
  for (const [latest, current, expected] of versions) assert.equal(isNewer(latest, current), expected, `${latest} / ${current}`);
});

test("store link derivation and absent configuration", () => {
  assert.equal(updateUrlFor("https://store.example/l/Example1"), "https://store.example/api/public/links/Example1/latest");
  for (const value of [undefined, "", "https://store.example/other"]) assert.equal(updateUrlFor(value), null);
});

test("offline, non-success, invalid body and malformed response yield no update", async () => {
  const cases = [async () => {throw new Error("offline");}, async () => new Response("unavailable", {status: 503}), async () => new Response("{"), async () => Response.json({version: 4, url: "x"}), async () => Response.json(null), async () => Response.json({version: "1.2.3"})];
  for (const fetcher of cases) assert.equal(await fetchUpdate("https://store.example/update", fetcher as typeof fetch), null);
});

test("consumer fetches the injected address and returns newer version only", async () => {
  const fetcher: typeof fetch = async (address, options) => {
    assert.equal(address, "https://store.example/api/public/links/Example1/latest");
    assert.deepEqual(options, {headers: {accept: "application/json"}});
    return Response.json(fixture);
  };
  assert.deepEqual(await availableUpdate("https://store.example/l/Example1", "1.2.3", fetcher), fixture);
  assert.equal(await availableUpdate("https://store.example/l/Example1", "1.2.4", fetcher), null);
  assert.equal(await availableUpdate("bad", "1.2.3", async () => {throw new Error("must not fetch");}), null);
});

test("the settings give the store address, and disabled or absent settings give none", () => {
  assert.equal(updateAddress({inviteAddress: "https://store.example/l/Example1-other"}), "https://store.example/api/public/links/Example1-other/latest");
  assert.equal(updateAddress({enabled: true, inviteAddress: "http://store.example/l/a"}), "http://store.example/api/public/links/a/latest");
  assert.equal(updateAddress({enabled: false, inviteAddress: "https://store.example/l/Example1"}), null);
  assert.equal(updateAddress({}), null);
  assert.equal(updateAddress({inviteAddress: "https://store.example/l/a/b"}), null);
});
