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
  <div class="fixed bottom-0 w-full flex items-center justify-center pb-1">
    <p class="text-xs text-center text-muted-foreground sm:text-muted/50 px-6">
      By using this service, you agree to the <a href="/terms" class="underline">Terms of Service</a> and <a href="/privacy" class="underline">Privacy Policy</a>
    </p>
  </div>
</div>