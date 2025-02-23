<script lang="ts">
  import LoginForm from './LoginForm.svelte';

  let { data } = $props();
</script>

<div class="md:w-min bg-background sm:rounded-xl sm:border flex justify-center">
  <LoginForm form={data.form} title="Student Login" subtitle="Welcome back! Sign in to your account" emaillabel="Student Email" showSignUp={true} />
</div>