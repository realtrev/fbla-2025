<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { buttonVariants } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY } from '$env/static/public'
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';
  import Combobox from '$lib/components/Combobox.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { buildDebouncer, postAction, formatDate } from '$lib/utils';
  import { goto } from '$app/navigation';
  import type { ListingModel, OrganizationModel, SchoolModel } from '../../../../../app';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import Cloud from 'lucide-svelte/icons/cloud';
  import CloudUpload from 'lucide-svelte/icons/cloud-upload';
  import Save from 'lucide-svelte/icons/save';
  import * as Tabs from "$lib/components/ui/tabs";
  import JobListing from '$lib/components/JobListing.svelte';
  import { currentSchool } from '$lib/pocketbase';

  let {
    listing,
    organization,
  }: {
    listing: ListingModel;
    organization: OrganizationModel;
  } = $props();

  let removeAlertOpen = $state(false);

  // const approveListing = postAction("??/approveListing", {
  //   onResult: ({ action }) => {
  //     if (action.type === "success") {
  //       toast.success("Approved listing.");
  //
  //       listing.confirmedSchools = action.data.confirmedSchools;
  //       listing.requestedSchools = action.data.requestedSchools;
  //     }
  //   }
  // });

  // const deleteListing = postAction("??/approveListing", {
  //   onSubmit: ({ formData }) => {
  //     formData.append("remove", "true");
  //   },
  //   onResult: ({ action }) => {
  //     console.log(action);
  //
  //     if (action.type === "success") {
  //       toast.success("Removed listing.");
  //       goto("/admin/s/listings");
  //     }
  //   }
  // });

  const options = [
    {
      value: "full-time",
      label: "Full Time"
    },
    {
      value: "part-time",
      label: "Part Time"
    },
    {
      value: "internship",
      label: "Internship"
    },
    {
      value: "volunteer",
      label: "Volunteer"
    },
  ];
</script>

<div class="flex justify-between items-center">
  <div class="flex gap-6 items-center">
    <Button
      variant="outline"
      size="icon"
      href="/jobs"
    >
      <ChevronLeft class="h-5 w-5" />
    </Button>
  </div>

  <div class="flex gap-4 items-center">
    <Button>
      Apply
    </Button>
  </div>
</div>

<JobListing {listing} {organization} />