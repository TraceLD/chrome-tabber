<script lang="ts">
  import type { FuseResultWithMatches } from "./lib/types";
  import Favicon from "./Favicon.svelte";
  import CloseButton from "./CloseButton.svelte";
  import SelectionIndicator from "./SelectionIndicator.svelte";
  import HighlightedText from "./HighlightedText.svelte";

  let {
    result,
    selected,
    onclick,
    onclose,
  }: {
    result: FuseResultWithMatches;
    selected: boolean;
    onclick: () => void;
    onclose: () => void;
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
  let titleIndices = $derived(
    result.matches?.find((m) => m.key === "title")?.indices,
  );
  let urlIndices = $derived(
    result.matches?.find((m) => m.key === "url")?.indices,
  );
</script>

<button
  type="button"
  role="option"
  aria-selected={selected}
  tabindex="-1"
  use:scrollIfSelected={selected}
  class="group flex w-full items-center gap-3 px-3.5 py-2.5 cursor-pointer border-none text-left text-inherit text-sm relative transition-colors duration-100
    {selected ? 'bg-[#242424]' : 'bg-transparent hover:bg-[#1e1e1e]'}"
  {onclick}
>
  {#if selected}
    <SelectionIndicator />
  {/if}

  <Favicon url={tab.favIconUrl} />

  <div class="min-w-0 flex-1">
    <div class="truncate text-[13px] text-[#d4d0c8] leading-snug">
      <HighlightedText text={tab.title} indices={titleIndices} />
    </div>
    <div class="truncate text-[11px] text-[#5a5a5a] mt-0.5 leading-snug">
      <HighlightedText text={tab.url} indices={urlIndices} />
    </div>
  </div>

  <CloseButton {selected} onclick={onclose} />
</button>
