export function isNewer(latest: string, current: string): boolean {
  if (current.startsWith("0.0.0")) return false;
  const parts = (value: string) => value.split("-")[0].split(".").map((part) => /^[+]?[0-9]+$/.test(part) && Number.isSafeInteger(Number(part)) ? Number(part) : 0);
  const a = parts(latest);
  const b = parts(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x > y;
  }
  return false;
}

export async function fetchUpdate(url: string, fetcher: typeof fetch): Promise<{version: string; url: string} | null> {
  try {
    const response = await fetcher(url, {headers: {accept: "application/json"}});
    if (!response.ok) return null;
    const value: unknown = await response.json();
    if (!value || typeof value !== "object" || !("version" in value) || !("url" in value)) return null;
    if (typeof value.version !== "string" || typeof value.url !== "string") return null;
    return {version: value.version, url: value.url};
  } catch {
    return null;
  }
}
