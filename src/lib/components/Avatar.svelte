<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';

  import { currentUser } from '$lib/pocketbase';

  const src = `https://jobfair-fbla-2025.pockethost.io/api/files/_pb_users_auth_/${$currentUser.id}/${$currentUser.avatar}`;
  console.log(src);
</script>

<Avatar.Root>
  <Avatar.Image {src} alt={$currentUser.firstName} />
  <Avatar.Fallback>
    {#if $currentUser.firstName.length && $currentUser.lastName.length}
      {$currentUser.firstName[0]}{$currentUser.lastName[0]}
    {/if}
  </Avatar.Fallback>
</Avatar.Root>