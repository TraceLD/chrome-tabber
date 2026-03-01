<script lang="ts">
  import Fuse from "fuse.js";
  import type { TabEntry, FuseResultWithMatches } from "./lib/types";
  import SearchInput from "./SearchInput.svelte";
  import TabItem from "./TabItem.svelte";

  let query = $state("");
  let selectedIndex = $state(0);
  let tabs = $state<TabEntry[]>([]);
  let fuse = $state<Fuse<TabEntry> | null>(null);

  let results: FuseResultWithMatches[] = $derived.by(() => {
    if (!fuse) return tabs.map((item) => ({ item, matches: undefined }));
    const q = query.trim();
    if (!q) return tabs.map((item) => ({ item, matches: undefined }));
    return fuse.search(q);
  });

  $effect(() => {
    void query;
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

  function switchToTab(tab: TabEntry) {
    chrome.tabs.update(tab.id, { active: true });
    chrome.windows.update(tab.windowId, { focused: true });
    window.close();
  }

  function closeTab(tab: TabEntry) {
    chrome.tabs.remove(tab.id);
    tabs = tabs.filter((t) => t.id !== tab.id);
    fuse = new Fuse(tabs, {
      keys: ["title", "url"],
      threshold: 0.4,
      includeMatches: true,
    });
    if (selectedIndex >= results.length - 1) {
      selectedIndex = Math.max(0, results.length - 2);
    }
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
    } else if (e.ctrlKey && e.key === "Backspace") {
      e.preventDefault();
      const entry = results[selectedIndex];
      if (entry) closeTab(entry.item);
    } else if (e.key === "Escape") {
      window.close();
    }
  }
</script>

<SearchInput bind:value={query} {onKeydown} />

<ul
  role="listbox"
  class="list-none max-h-[472px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#333_transparent]"
>
  {#if results.length === 0}
    <li class="px-3.5 py-8 text-center text-[#555] text-[13px]">
      No matching tabs
    </li>
  {:else}
    {#each results as result, i}
      <TabItem
        {result}
        selected={i === selectedIndex}
        onclick={() => switchToTab(result.item)}
        onclose={() => closeTab(result.item)}
      />
    {/each}
  {/if}
</ul>
