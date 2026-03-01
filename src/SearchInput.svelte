<script lang="ts">
  let {
    value = $bindable(""),
    onkeydown,
  }: {
    value: string;
    onkeydown: (e: KeyboardEvent) => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_autofocus -->
<input
  type="text"
  placeholder="Search tabs..."
  autofocus
  bind:value
  {onkeydown}
  class="w-full px-3.5 py-3 text-sm border-none outline-none bg-[#181825] text-gray-200 border-b border-[#313244] placeholder:text-gray-500"
/>
