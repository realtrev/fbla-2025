<script lang="ts">
  import { currentUser } from '$lib/pocketbase';
</script>

<div class="p-5">

  <p class="font-semibold">Welcome, {$currentUser?.firstName}</p>

</div>
