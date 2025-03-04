<script lang="ts">
  import { page } from '$app/state';
  import Bell from 'lucide-svelte/icons/bell';
  import { Input } from '$lib/components/ui/input';
  import Logo from '$lib/components/Logo.svelte';
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  import * as Tooltip from "$lib/components/ui/tooltip";
  import { Button } from "$lib/components/ui/button";

  import { currentSchool } from '$lib/pocketbase';

  const dashboard = [
    {
      value: $currentSchool?.name ?? 'School',
      href: '/admin/s/profile'
    },
    {
      value: 'Dashboard',
      href: '/admin/s/dashboard'
    },
  ];

  const listings = [
    {
      value: $currentSchool?.name ?? 'School',
      href: '/admin/s/profile'
    },
    {
      value: 'Listings',
      href: '/admin/s/listings'
    },
    {
      value: 'Manage Listing',
      href: '/admin/s/listings/'
    },
  ];

  const students = [
    {
      value: $currentSchool?.name ?? 'School',
      href: '/admin/s/profile'
    },
    {
      value: 'Students',
      href: '/admin/s/students'
    }
  ];

  const messages = [
    {
      value: $currentSchool?.name ?? 'School',
      href: '/admin/s/profile'
    },
    {
      value: 'Messages',
      href: '/admin/s/messages'
    },
  ];

  let breadcrumbList = $state([]) as {value: string, href: string}[];

  $effect(() => {
    console.log(page.url.pathname);
    updateBreadCrumb(page.url.pathname);
  });

  function updateBreadCrumb(url: string) {
    if (url.startsWith('/admin/s/dashboard')) {
      breadcrumbList = dashboard.slice();
      return;
    }

    if (url.startsWith('/admin/s/students')) {
      breadcrumbList = students;
      return;
    }

    if (url.startsWith('/admin/s/applications')) {
      breadcrumbList = applications;
      return;
    }
  }

</script>

<Breadcrumb.Root>
  <div class="hidden md:block">
    <Breadcrumb.List>
      {#each breadcrumbList as item, i}
        {#if i !== breadcrumbList.length - 1}
          <Breadcrumb.Item>
            <Breadcrumb.Link href={item.href}>{item.value}</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
        {:else}
          <Breadcrumb.Item>
            <Breadcrumb.Page class="font-semibold">{item.value}</Breadcrumb.Page>
          </Breadcrumb.Item>
        {/if}
      {/each}
    </Breadcrumb.List>
  </div>
</Breadcrumb.Root>