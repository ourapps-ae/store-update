import {updateUrlFor} from "../implementation/server/store.ts";
import {fetchUpdate, isNewer} from "../implementation/web/update.ts";

export async function availableUpdate(invitation: string, current: string, fetcher: typeof fetch) {
  const address = updateUrlFor(invitation);
  const update = address ? await fetchUpdate(address, fetcher) : null;
  return update && isNewer(update.version, current) ? update : null;
}
