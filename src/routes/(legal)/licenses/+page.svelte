<script lang="ts">
  import Document from '$lib/components/Document.svelte';

  import LICENSES from '$lib/documents/LICENSES.md?raw';
</script>

<Document content={LICENSES} />