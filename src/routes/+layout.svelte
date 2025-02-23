<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from 'svelte-sonner';
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
  import { pb, currentUser, currentSchool, currentOrganization } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import type { AuthRecord } from 'pocketbase';
  import { LocalStore } from '$lib/stores/localStorage';
  import type { OrganizationModel, SchoolModel } from '../app';

  let { data, children }: {
    data: {
      user: AuthRecord;
      school: SchoolModel;
      organization: OrganizationModel;
    };
    children: Snippet;
  } = $props();

  currentOrganization.set(data?.organization ?? null);
  currentSchool.set(data?.school ?? null);
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

<Toaster position="bottom-center" />
{@render children()}
