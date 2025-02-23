<script lang="ts">
  import RegisterForm from './RegisterForm.svelte';

  let { data } = $props();
</script>

<div class="md:w-min bg-background sm:rounded-xl sm:border flex justify-center">
  <RegisterForm page1={data.basicInfo} page2={data.password} title="Student Registration" subtitle="Welcome to JobFair! Get started below" emaillabel="Student Email" />
</div>