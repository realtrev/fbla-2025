<script lang="ts">
  import Button from '$lib/components/Button.svelte';
</script>

<div class="p-5">
  <h1 class="heading-sm">Welcome to JobFair. We help jobs find students.</h1>

  <Button
    label="Log in"
    color="primary"
    class="w-min mt-3"
    size="md"
    link="login"
  />

  <Button
    label="Sign up"
    color="surface"
    class="w-min mt-3"
    size="md"
    link="student-register"
  />
</div>
