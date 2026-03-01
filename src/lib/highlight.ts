import type { RangeTuple } from "fuse.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function highlightMatches(
  text: string,
  indices: readonly RangeTuple[] | undefined,
): string {
  if (!indices) return escapeHtml(text);

  const chars = [...text];
  const highlighted = new Set<number>();
  for (const [start, end] of indices) {
    for (let i = start; i <= end; i++) highlighted.add(i);
  }

  let result = "";
  for (let i = 0; i < chars.length; i++) {
    const escaped = escapeHtml(chars[i]);
    if (highlighted.has(i)) {
      result += `<span class="text-amber-300 font-semibold">${escaped}</span>`;
    } else {
      result += escaped;
    }
  }
  return result;
}
