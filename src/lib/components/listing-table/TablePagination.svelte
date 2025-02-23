<script lang="ts">
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import * as Pagination from "$lib/components/ui/pagination";

  let {
   count = $bindable(1),
   page = $bindable(0),
   perPage = $bindable(20),
  }: {
   count?: number,
   perPage?: number,
   page?: number
  } = $props();

  let currentPage = $state(1);

  $effect(() => {
   page = currentPage - 1;
  });
 </script>

 <Pagination.Root {count} {perPage} siblingCount={1} let:pages let:currentPage bind:page={currentPage}>
  <Pagination.Content>
   <Pagination.Item>
    <Pagination.PrevButton>
     <ChevronLeft class="h-4 w-4" />
     <span class="hidden sm:block">Previous</span>
    </Pagination.PrevButton>
   </Pagination.Item>
   {#each pages as page (page.key)}
    {#if page.type === "ellipsis"}
     <Pagination.Item>
      <Pagination.Ellipsis />
     </Pagination.Item>
    {:else}
     <Pagination.Item>
      <Pagination.Link {page} isActive={currentPage === page.value}>
       {page.value}
      </Pagination.Link>
     </Pagination.Item>
    {/if}
   {/each}
   <Pagination.Item>
    <Pagination.NextButton>
     <span class="hidden sm:block">Next</span>
     <ChevronRight class="h-4 w-4" />
    </Pagination.NextButton>
   </Pagination.Item>
  </Pagination.Content>
 </Pagination.Root>