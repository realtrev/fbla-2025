<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from '$lib/components/ui/badge';

	let {
		listingType = $bindable('Undefined')
	} = $props();

  const values = {
    "volunteer": "Volunteer",
    "full-time":"Full Time",
    "part-time": "Part Time",
    "internship": "Internship"
  };

  function present(listingType: string) {
    return values[listingType] ?? listingType;
  }
</script>

<Badge variant="outline">{listingType}</Badge>