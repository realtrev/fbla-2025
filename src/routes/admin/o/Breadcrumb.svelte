<script lang="ts">
  import { page } from '$app/state';
  import Bell from 'lucide-svelte/icons/bell';
  import { Input } from '$lib/components/ui/input/index';
  import Logo from '$lib/components/Logo.svelte';
  import * as Avatar from "$lib/components/ui/avatar/index";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";

  import * as Tooltip from "$lib/components/ui/tooltip/index";
  import { Button } from "$lib/components/ui/button/index";

  import { currentOrganization } from '$lib/pocketbase';

  const dashboard = [
    {
      value: $currentOrganization?.name ?? 'Organization',
      href: '/admin/o/profile'
    },
    {
      value: 'Dashboard',
      href: '/admin/o/dashboard'
    },
  ];

  const listings = [
    {
      value: $currentOrganization?.name ?? 'Organization',
      href: '/admin/o/profile'
    },
    {
      value: 'Listings',
      href: '/admin/o/listings'
    },
    {
      value: 'Manage Listing',
      href: '/admin/o/listings/'
    },
  ];

  const applications = [
    {
      value: $currentOrganization?.name ?? 'Organization',
      href: '/admin/o/profile'
    },
    {
      value: 'Applications',
      href: '/admin/o/applications'
    },
  ];

  const schools = [
    {
      value: $currentOrganization?.name ?? 'Organization',
      href: '/admin/o/profile'
    },
    {
      value: 'Schools',
      href: '/admin/o/schools'
    },
  ];

  const messages = [
    {
      value: $currentOrganization?.name ?? 'Organization',
      href: '/admin/o/profile'
    },
    {
      value: 'Messages',
      href: '/admin/o/messages'
    },
  ];

  let breadcrumbList = $state([]) as {value: string, href: string}[];

  updateBreadCrumb(page.url.pathname);

  function updateBreadCrumb(url: string) {
    if (url.startsWith('/admin/o/dashboard')) {
      breadcrumbList = dashboard.slice();
      return;
    }

    if (url.startsWith('/admin/o/listings/')) {
      breadcrumbList = listings.slice();
      return;
    }

    if (url.startsWith('/admin/o/listings')) {
      breadcrumbList = listings.slice(0, 2);
      return;
    }

    if (url.startsWith('/admin/o/schools')) {
      breadcrumbList = schools;
      return;
    }

    if (url.startsWith('/admin/o/applications')) {
      breadcrumbList = applications;
      return;
    }

    if (url.startsWith('/admin/o/messages')) {
      breadcrumbList = messages;
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