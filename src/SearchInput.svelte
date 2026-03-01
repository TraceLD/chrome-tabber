<script lang="ts">
  let {
    value = $bindable(""),
    onKeydown,
  }: {
    value: string;
    onKeydown: (e: KeyboardEvent) => void;
  } = $props();
</script>

<div class="relative flex items-center border-b border-[#2a2a2a]">
  <svg
    class="absolute left-3.5 w-4 h-4 text-[#6b6b6b] pointer-events-none"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
  <!-- svelte-ignore a11y_autofocus -->
  <input
    type="text"
    placeholder="Search tabs…"
    autofocus
    bind:value
    onkeydown={onKeydown}
    class="w-full pl-10 pr-4 py-3.5 text-[13px] border-none outline-none bg-transparent text-[#e2e0dc] placeholder:text-[#555] tracking-wide"
  />
  {#if value}
    <button
      type="button"
      title="Clear search"
      onclick={() => (value = "")}
      class="absolute right-3 w-5 h-5 flex items-center justify-center rounded-full bg-[#333] text-[#888] hover:bg-[#444] hover:text-[#bbb] cursor-pointer border-none transition-colors duration-150"
    >
      <svg
        class="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  {/if}
</div>
