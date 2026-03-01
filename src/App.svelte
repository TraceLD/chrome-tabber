<script lang="ts">
  import Fuse from "fuse.js";
  import type { RangeTuple } from "fuse.js";

  interface TabEntry {
    id: number;
    windowId: number;
    title: string;
    url: string;
    favIconUrl?: string;
  }

  let query = $state("");
  let selectedIndex = $state(0);
  let tabs = $state<TabEntry[]>([]);
  let fuse = $state<Fuse<TabEntry> | null>(null);
  type FuseResultWithMatches = {
    item: TabEntry;
    matches?: readonly Fuse.FuseResultMatch[] | undefined;
  };

  let results: FuseResultWithMatches[] = $derived.by(() => {
    if (!fuse) return tabs.map((item) => ({ item, matches: undefined }));
    const q = query.trim();
    if (!q) return tabs.map((item) => ({ item, matches: undefined }));
    return fuse.search(q);
  });

  $effect(() => {
    void query; // track query changes to reset selection
    selectedIndex = 0;
  });

  $effect(() => {
    async function loadTabs() {
      const allTabs = await chrome.tabs.query({});
      tabs = allTabs.map((t) => ({
        id: t.id!,
        windowId: t.windowId,
        title: t.title || "",
        url: t.url || "",
        favIconUrl: t.favIconUrl,
      }));
      fuse = new Fuse(tabs, {
        keys: ["title", "url"],
        threshold: 0.4,
        includeMatches: true,
      });
    }
    loadTabs();
  });

  function scrollIfSelected(node: HTMLLIElement, isSelected: boolean) {
    if (isSelected) node.scrollIntoView({ block: "nearest" });
    return {
      update(isSelected: boolean) {
        if (isSelected) node.scrollIntoView({ block: "nearest" });
      },
    };
  }

  function escapeHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightMatches(
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

  function switchToTab(tab: TabEntry) {
    chrome.tabs.update(tab.id, { active: true });
    chrome.windows.update(tab.windowId, { focused: true });
    window.close();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[selectedIndex];
      if (entry) switchToTab(entry.item);
    } else if (e.key === "Escape") {
      window.close();
    }
  }
</script>

<!-- svelte-ignore a11y_autofocus -->
<input
  type="text"
  placeholder="Search tabs..."
  autofocus
  bind:value={query}
  onkeydown={onKeydown}
  class="w-full px-3.5 py-3 text-sm border-none outline-none bg-[#181825] text-gray-200 border-b border-[#313244] placeholder:text-gray-500"
/>

<ul
  role="listbox"
  class="list-none max-h-[412px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#45475a_transparent]"
>
  {#if results.length === 0}
    <li class="px-3.5 py-5 text-center text-gray-500">No matching tabs</li>
  {:else}
    {#each results as result, i}
      {@const tab = result.item}
      {@const titleMatch = result.matches?.find((m) => m.key === "title")}
      {@const urlMatch = result.matches?.find((m) => m.key === "url")}
      {@const titleHtml = highlightMatches(tab.title, titleMatch?.indices)}
      {@const urlHtml = highlightMatches(tab.url, urlMatch?.indices)}
      <button
        type="button"
        role="option"
        aria-selected={i === selectedIndex}
        tabindex="-1"
        use:scrollIfSelected={i === selectedIndex}
        class="flex w-full items-center gap-2.5 px-3.5 py-2 cursor-pointer border-b border-[#252536] hover:bg-[#2a2a3c] bg-transparent border-none text-left text-inherit text-sm {i === selectedIndex ? 'bg-[#313244]' : ''}"
        onclick={() => switchToTab(tab)}
      >
        {#if tab.favIconUrl}
          <img
            class="w-4 h-4 shrink-0 rounded-sm"
            src={tab.favIconUrl}
            alt=""
          />
        {:else}
          <div class="w-4 h-4 shrink-0"></div>
        {/if}
        <div class="min-w-0 flex-1">
          <div class="truncate text-[#cdd6f4]">{@html titleHtml}</div>
          <div class="truncate text-[11px] text-gray-500 mt-px">
            {@html urlHtml}
          </div>
        </div>
      </button>
    {/each}
  {/if}
</ul>
