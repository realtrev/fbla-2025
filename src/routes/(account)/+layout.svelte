<script lang="ts">
	import { type Snippet } from 'svelte';

  let {
    children
  } : {
    children: Snippet<[]>
  } = $props();
</script>

<div class="w-full h-min min-h-0 sm:min-h-screen sm:flex bg-white justify-center items-center sm:bg-gradient-to-tl sm:from-blue-900 sm:to-teal-500">
  <div id="form" class="bg-white w-screen sm:max-w-[32rem] shrink-0 h-min sm:rounded-2xl flex items-center sm:my-8 sm:shadow-2xl">
    {@render children()}
  </div>
</div>