<script lang="ts">
	import { type Snippet } from 'svelte';

  let {
    children
  } : {
    children: Snippet<[]>
  } = $props();
</script>

<div class="py-5 w-full h-min min-h-0 sm:min-h-screen sm:flex bg-white justify-center items-center sm:bg-gradient-to-tl sm:from-blue-900 sm:to-teal-500">
  {@render children()}
</div>