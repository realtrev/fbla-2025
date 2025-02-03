<script lang="ts">
  // check
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
  import { pb, currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import type { AuthRecord } from 'pocketbase';
  import { LocalStore, cookiesAccepted } from '$lib/stores/localStorage';

  let { data, children }: {
    data: {
      user: AuthRecord;
    };
    children: Snippet;
  } = $props();

  currentUser.set(data?.user ?? null);

  onMount(() => {
    LocalStore.loadAll();
	  pb.authStore.loadFromCookie(document.cookie);

    if (!$currentUser) return;

    // request the latest user data
    pb.collection('users').subscribe($currentUser.id, (e: {action: string; record: AuthRecord}) => {
      if (e.action === 'update') {
        console.log('currentUser updated', e.record);
        currentUser.set(e.record);

      }

      if (e.action === 'delete') {
        goto("/api/logout");
      }
    });

    pb.authStore.onChange((token, record) => {
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
