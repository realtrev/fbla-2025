<script lang="ts">
  import Markdown from '$lib/components/Markdown.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Logo from '$lib/components/Logo.svelte';

  let {
    content
  }: {
    content: string
  } = $props();
</script>

<div class="px-6 py-12 flex flex-col w-screen items-center justify-center">
  <Logo variant="large" href="/" />
  <div class="max-w-screen-lg mt-6">
    <Markdown {content} />
  </div>
</div>
<Footer hideLogo={true} />