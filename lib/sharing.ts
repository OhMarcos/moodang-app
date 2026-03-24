/**
 * Sharing utilities — Web Share API, image download, clipboard link copy
 */

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL ?? "https://moodang.app";

/** Generate a shareable URL for the share landing page */
export function generateShareUrl(params: {
  type: "gwansang" | "saju";
  nickname?: string;
  title?: string;
  /** If available, use DB-backed reading ID for persistent share */
  readingId?: string | null;
}): string {
  const id = params.readingId ?? crypto.randomUUID().slice(0, 8);
  const sp = new URLSearchParams({ type: params.type });
  if (params.nickname) sp.set("nickname", params.nickname);
  if (params.title) sp.set("title", params.title);
  return `${BASE_URL}/share/${id}?${sp.toString()}`;
}

/** Track a share event via API (fire-and-forget) */
export function trackShareEvent(readingId: string, platform: string): void {
  if (!readingId) return;
  fetch("/api/shares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ readingId, platform }),
  }).catch(() => {
    // Non-critical — silently ignore
  });
}

/** Convert an HTMLCanvasElement to a Blob (PNG) */
function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
    );
  });
}

/**
 * Share a card image using the Web Share API (native share sheet).
 * Falls back to download if share is not supported.
 * Returns true if shared/downloaded successfully.
 */
export async function shareCardImage(
  canvas: HTMLCanvasElement,
  text: string,
): Promise<boolean> {
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], "moodang-card.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ text, files: [file] });
      return true;
    }
  } catch (err) {
    // User cancelled or API not available — fall through to download
    if (err instanceof DOMException && err.name === "AbortError") return false;
  }

  // Fallback: download
  return downloadCardImage(canvas, "moodang-card.png");
}

/** Download the card canvas as a PNG file */
export function downloadCardImage(
  canvas: HTMLCanvasElement,
  filename = "moodang-card.png",
): boolean {
  try {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    return true;
  } catch {
    return false;
  }
}

/** Copy a share link to the clipboard. Returns true on success. */
export async function copyShareLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
