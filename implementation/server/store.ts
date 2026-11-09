export function updateUrlFor(inviteUrl: string | undefined): string | null {
  if (!inviteUrl || /[\s\\]/u.test(inviteUrl)) return null;
  try {
    const original = /^https?:\/\/([^/?#]+)(\/[^?#]*)(?:[?#]|$)/i.exec(inviteUrl);
    if (!original || original[1].includes("@") || !/^\/l\/[^/]+$/.test(original[2])) return null;
    const url = new URL(inviteUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    const match = /^\/l\/([^/]+)$/.exec(url.pathname);
    if (!match || /[/\\\u0000-\u001f\u007f]/u.test(decodeURIComponent(match[1]))) return null;
    return match ? `${url.origin}/api/public/links/${match[1]}/latest` : null;
  } catch {
    return null;
  }
}

// The collected settings: `inviteAddress` is the invitation link; `enabled` false switches updates off.
export type UpdateSettings = { enabled?: boolean; inviteAddress?: string };
export function updateAddress(settings: UpdateSettings): string | null {
  return settings.enabled === false ? null : updateUrlFor(settings.inviteAddress);
}
