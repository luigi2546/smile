export function getStitchApiKey(): string {
  const key = process.env.STITCH_GOOGLE_API_KEY;
  if (!key) {
    throw new Error('STITCH_GOOGLE_API_KEY is not set. Add it to .env.local or your secret manager.');
  }
  return key;
}

export async function stitchFetch(input: RequestInfo, init?: RequestInit) {
  const apiKey = getStitchApiKey();
  const existingHeaders = init?.headers instanceof Headers ? Object.fromEntries(init.headers.entries()) : (init?.headers as Record<string, string> | undefined) || {};
  const headers = { ...existingHeaders, 'X-Goog-Api-Key': apiKey } as Record<string, string>;
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stitch request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}
