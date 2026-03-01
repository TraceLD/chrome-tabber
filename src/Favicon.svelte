<script lang="ts">
  let { url }: { url?: string } = $props();
</script>

{#if url}
  <img class="w-[18px] h-[18px] shrink-0 rounded" src={url} alt="" />
{:else}
  <div class="w-[18px] h-[18px] shrink-0 rounded bg-[#2a2a2a] flex items-center justify-center">
    <svg class="w-2.5 h-2.5 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  </div>
{/if}
