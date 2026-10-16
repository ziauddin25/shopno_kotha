"use client";

export type ShareOutcome = "shared" | "copied" | "unavailable" | "failed";

type ShareCapableNavigator = Navigator & {
  share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
};

/**
 * Shares the current page with the Web Share API, falling back to the
 * clipboard, and finally reporting that neither is available.
 */
export async function sharePage(options: { title: string; text?: string }): Promise<ShareOutcome> {
  if (typeof navigator === "undefined") return "unavailable";

  const url = window.location.href;
  const nav = navigator as ShareCapableNavigator;

  if (typeof nav.share === "function") {
    try {
      await nav.share({ title: options.title, text: options.text, url });
      return "shared";
    } catch {
      return "failed";
    }
  }

  if (typeof nav.clipboard?.writeText === "function") {
    try {
      await nav.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }

  return "unavailable";
}

export async function copyPageLink(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as ShareCapableNavigator;
  if (typeof nav.clipboard?.writeText !== "function") return false;
  try {
    await nav.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}
