<script lang="ts">
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import * as Pagination from "$lib/components/ui/pagination";
  import { MediaQuery } from "svelte/reactivity";

  const isDesktop = new MediaQuery("(min-width: 768px)");

  let {
    count = $bindable(1),
    perPage,
    currentPage = $bindable(1),

    ...props
  } : {
    count: number,
    perPage: number,
    currentPage?: number,

    onpagechange?: (page: number) => void,
  } = $props();

  function pageChangeWrapper(page: number) {
    currentPage = page;
    props.onpagechange?.(page);
  }

  const siblingCount = $derived(isDesktop.current ? 1 : 0);
 </script>

<Pagination.Root {count} {perPage} {siblingCount} bind:page={currentPage} onPageChange={pageChangeWrapper}>
 {#snippet children({ pages, currentPage })}
  <Pagination.Content>
   <Pagination.Item>
    <Pagination.PrevButton>
     <ChevronLeft class="size-4" />
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
     <ChevronRight class="size-4" />
    </Pagination.NextButton>
   </Pagination.Item>
  </Pagination.Content>
 {/snippet}
</Pagination.Root>