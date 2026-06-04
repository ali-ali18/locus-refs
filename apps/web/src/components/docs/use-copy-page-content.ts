"use client";

import { useState } from "react";

export function useCopyPageContent(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const pathname = window.location.pathname;
    let content = "";

    try {
      const res = await fetch(`/api/docs/content?path=${pathname}`);
      if (res.ok) {
        content = await res.text();
      }
    } catch {
      content = document.querySelector("article")?.innerText ?? "";
    }

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  }

  return { copied, copy };
}
