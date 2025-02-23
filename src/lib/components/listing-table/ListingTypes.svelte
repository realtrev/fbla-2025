<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from '$lib/components/ui/badge';
  export let listingType: string;

  const values = [
    {
      id: "volunteer",
      title: "Volunteer"
    },
    {
      id: "full-time",
      title: "Full Time"
    },
    {
      id: "part-time",
      title: "Part Time"
    },
    {
      id: "internship",
      title: "Internship"
    }
  ];

  function present(listingType: string) {
    return values.find(v => v.id === listingType)?.title ?? listingType;
  }
</script>

<Badge variant="alternate">{present(listingType)}</Badge>