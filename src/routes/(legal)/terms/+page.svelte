<script lang="ts">
  import Document from '$lib/components/Document.svelte';

  import TERMS from '$lib/documents/TERMS.md?raw';
</script>

<Document content={TERMS} />