<script lang="ts">
  import { highlightMatches } from "./lib/highlight";
  import type { FuseResultWithMatches } from "./lib/types";

  let {
    result,
    selected,
    onclick,
  }: {
    result: FuseResultWithMatches;
    selected: boolean;
    onclick: () => void;
  } = $props();

  function scrollIfSelected(node: HTMLElement, isSelected: boolean) {
    if (isSelected) node.scrollIntoView({ block: "nearest" });
    return {
      update(isSelected: boolean) {
        if (isSelected) node.scrollIntoView({ block: "nearest" });
      },
    };
  }

  let tab = $derived(result.item);
  let titleMatch = $derived(result.matches?.find((m) => m.key === "title"));
  let urlMatch = $derived(result.matches?.find((m) => m.key === "url"));
  let titleHtml = $derived(highlightMatches(tab.title, titleMatch?.indices));
  let urlHtml = $derived(highlightMatches(tab.url, urlMatch?.indices));
</script>

<button
  type="button"
  role="option"
  aria-selected={selected}
  tabindex="-1"
  use:scrollIfSelected={selected}
  class="flex w-full items-center gap-2.5 px-3.5 py-2 cursor-pointer border-b border-[#252536] hover:bg-[#2a2a3c] bg-transparent border-none text-left text-inherit text-sm {selected ? 'bg-[#313244]' : ''}"
  {onclick}
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
