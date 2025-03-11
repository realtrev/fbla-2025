<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { currentUser } from '$lib/pocketbase';
</script>

<div class="absolute w-screen flex items-center justify-center">
  <div class="max-w-screen-xl w-full flex px-6 py-6 justify-between">
    <Logo class="text-white" variant="large" />
    <div class="flex gap-4">
      <!--<Button href="/register_student" variant="outline">-->
      <!--  School Admins-->
      <!--</Button>-->
      <!--<Button href="/register_student" variant="outline">-->
      <!--  Business Admins-->
      <!--</Button>-->
      {#if !$currentUser}
      <Button href="/register_student">
        Sign up
      </Button>
      <Button href="/login">
        Log in
      </Button>
      {:else}
      <Button href="/login">
        Open app
      </Button>
      {/if}
    </div>
  </div>
</div>