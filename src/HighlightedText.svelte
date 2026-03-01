<script lang="ts">
  import type { RangeTuple } from "fuse.js";

  let { text, indices }: { text: string; indices?: readonly RangeTuple[] } =
    $props();

  interface Segment {
    value: string;
    highlighted: boolean;
  }

  let segments: Segment[] = $derived.by(() => {
    if (!indices?.length) return [{ value: text, highlighted: false }];

    const result: Segment[] = [];
    let cursor = 0;

    for (const [start, end] of indices) {
      if (cursor < start) {
        result.push({ value: text.slice(cursor, start), highlighted: false });
      }
      result.push({ value: text.slice(start, end + 1), highlighted: true });
      cursor = end + 1;
    }

    if (cursor < text.length) {
      result.push({ value: text.slice(cursor), highlighted: false });
    }

    return result;
  });
</script>

{#each segments as segment}{#if segment.highlighted}<span
      class="text-[#5b9ef5] font-medium">{segment.value}</span>{:else}{segment.value}{/if}{/each}
