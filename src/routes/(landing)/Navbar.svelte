<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<div class="absolute w-screen flex items-center justify-center">
  <div class="max-w-screen-xl w-full flex px-6 py-6 justify-between">
    <Logo class="text-white" variant="large" />
    <Button href="/login">
      Log in
    </Button>
  </div>
</div>