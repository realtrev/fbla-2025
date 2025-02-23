<script lang="ts">
  import Menu from 'lucide-svelte/icons/menu';
  import House from 'lucide-svelte/icons/house';
  import ListCheck from 'lucide-svelte/icons/list-check';
  import FileIcon from 'lucide-svelte/icons/file';
  import Send from 'lucide-svelte/icons/send';

  import * as Avatar from "$lib/components/ui/avatar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Input } from '$lib/components/ui/input';
  import Sidebar from '$lib/components/navbar/Navbar.svelte';
  import { goto } from '$app/navigation';

  import Breadcrumb from './Breadcrumb.svelte';

  import * as Tooltip from "$lib/components/ui/tooltip/index";
  import { Button } from "$lib/components/ui/button/index";

  import { currentOrganization } from '$lib/pocketbase';

  let {
    children
  } = $props();

  let openSidebar = $state(false);
  let breadcrumbList = $state([]) as {href: string, title: string, icon: any, badge?: string}[];

  let items = [
    {
      href: "/admin/o/dashboard",
      title: "Dashboard",
      icon: House,
      badge: "3"
    },
    {
      href: "/admin/o/listings",
      title: "Listings",
      icon: ListCheck
    },
    {
      href: "/admin/o/applications",
      title: "Applications",
      icon: FileIcon,
      badge: "HEY"
    },
    {
      href: "/admin/o/messages",
      title: "Messages",
      icon: Send,
      badge: "133"
    }
  ];
</script>

<Sidebar {items} bind:open={openSidebar} />
<div class="min-h-screen flex flex-col pl-0 lg:pl-60">
  <div class="flex-shrink-0 border-b flex justify-between px-6 h-16">
    <div class="flex items-center justify-start gap-4">
      <div class="lg:hidden block">
        <Button
          variant="outline"
          size="icon"
          onclick={() => openSidebar = true}
        >
          <Menu class="h-5 w-5" />
        </Button>
      </div>
      <Breadcrumb />
    </div>

    <div class="flex items-center justify-end gap-4">
      <Input class="grow w-max md:w-56 shadow" placeholder="Search..." />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            variant="outline"
            size="icon"
            class="overflow-hidden rounded-full"
            builders={[builder]}
          >
            <Avatar.Root>
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar.Root>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Item>Support</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onclick={() => goto("/api/logout")}>Logout</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
  <div class="flex flex-col flex-1 p-6 bg-muted/50">
    {@render children()}
  </div>
</div>