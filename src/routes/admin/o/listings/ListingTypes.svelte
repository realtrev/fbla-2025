<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from '$lib/components/ui/badge';

	let {
		listingType = $bindable('Undefined')
	} = $props();

  function present(listingType: string) {
    return values[listingType] ?? listingType;
  }
</script>

{#if listingType === "Published"}
  <Badge class="bg-foreground text-background hover:bg-foreground">{listingType}</Badge>
{:else}
  <Badge variant="outline">{listingType}</Badge>
{/if}