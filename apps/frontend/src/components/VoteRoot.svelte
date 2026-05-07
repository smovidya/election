<script lang="ts">
  import { onMount } from "svelte";
  import VoteRouter from "./VoteRouter.svelte";
  import { api, authHeader } from "@/lib/api";

  interface Props {
    candidateImages: [string, string][]; // we cant pass map from astro (i think)
  }

  let { candidateImages }: Props = $props();

  onMount(async () => {
    const headers = authHeader();
    if (!headers) {
      // redirect back to login page
      return
    }
    await api.election.eligibility.get({
      headers,
    });
  });
</script>

<VoteRouter {candidateImages} />
