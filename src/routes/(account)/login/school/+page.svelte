<script lang="ts">
  import LoginForm from '../LoginForm.svelte';

  let { data } = $props();
</script>

<div class="md:w-min bg-background sm:rounded-xl sm:border flex justify-center">
  <LoginForm form={data.form} title="School Admin Sign In" subtitle="Welcome back! Sign in to your account" emaillabel="School Admin Email" />
</div>