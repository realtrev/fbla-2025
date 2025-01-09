<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
  import { pb, currentUser } from '$lib/pocketbase';
	import type { User } from '$lib/types';
	import { goto } from '$app/navigation';

  let { data, children }: {
    data: {
      user: User;
    };
    children: Snippet;
  } = $props();

  currentUser.set(data?.user);

  onMount(() => {
    console.log('layout mounted', JSON.stringify($currentUser));
	  pb.authStore.loadFromCookie(document.cookie);

    if (!$currentUser) return;

    // request the latest user data
    pb.collection('users').subscribe($currentUser.id, (e: {action: string; record: User}) => {
      if (e.action === 'update') {
        currentUser.set(e.record);
      }

      if (e.action === 'delete') {
        goto("/logout");
      }
    });

    pb.authStore.onChange((token, record) => {
      console.log('authStore.onChange', record);
      if (pb.authStore.isValid) {
        // delete current cookie
        document.cookie = pb.authStore.exportToCookie({ path: '/' });
      } else {
        document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    });
  });

</script>

{@render children()}
