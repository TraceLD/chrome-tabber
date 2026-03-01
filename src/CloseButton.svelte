<script lang="ts">
  let {
    selected,
    onclick,
  }: {
    selected: boolean;
    onclick: () => void;
  } = $props();
</script>

<button
  type="button"
  onclick={(e) => { e.stopPropagation(); onclick(); }}
  class="shrink-0 w-6 h-6 flex items-center justify-center rounded-md
    transition-opacity duration-150
    bg-transparent hover:bg-[#333] text-[#666] hover:text-[#c45] cursor-pointer border-none
    {selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}"
  title="Close tab"
>
  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
</button>
