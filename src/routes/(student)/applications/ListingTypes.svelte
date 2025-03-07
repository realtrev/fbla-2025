<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from '$lib/components/ui/badge';

	let {
		listingType = $bindable('Undefined')
	} = $props();

  const values = [
    {
      id: "submitted",
      title: "Submitted"
    },
    {
      id: "reviewed",
      title: "Reviewed"
    },
    {
      id: "accepted",
      title: "Accepted"
    },
    {
      id: "rejected",
      title: "Rejected"
    }
  ];

  function present(listingType: string) {
    return values.find(v => v.id === listingType)?.title ?? listingType;
  }
</script>

<Badge variant="outline">{present(listingType)}</Badge>