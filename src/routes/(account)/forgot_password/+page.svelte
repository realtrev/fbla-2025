<script lang="ts">
  import ForgotPasswordForm from './ForgotPasswordForm.svelte';

  let {
    data
  }: {

  } = $props();
</script>

<div class="md:w-min bg-background sm:rounded-xl sm:border flex justify-center">
  <ForgotPasswordForm form={data.emailOnlyForm} title="Password Recovery" subtitle="Enter your email below to reset your password" successurl="/login" emaillabel="Student Email" />
</div>