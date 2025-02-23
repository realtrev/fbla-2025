<script lang="ts">
  import VerifyEmailForm from './VerifyEmailForm.svelte';
</script>

<div class="md:w-min bg-background sm:rounded-xl sm:border flex justify-center">
  <VerifyEmailForm title="Password Recovery" subtitle="Enter your email below to reset your password" successurl="/login" emaillabel="Student Email" />
</div>