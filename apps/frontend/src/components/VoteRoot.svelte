<script lang="ts">
  import { onMount } from "svelte";
  import VoteRouter from "./VoteRouter.svelte";
  import { api, authHeader } from "@/lib/api";

  interface Props {
    candidateImages: [string, string][]; // we cant pass map from astro (i think)
  }

  let { candidateImages }: Props = $props();

  let eligibility = $state(null) as null | {
    reason?: string;
    eligible: boolean;
  };

  let loading = $state(true);
  onMount(() => {
    load();
  });

  async function load() {
    const headers = authHeader();
    if (!headers) {
      // redirect back to login page
      window.location.href = "/";
      return;
    }

    const { data, error } = await api.election.eligibility.get({
      headers,
    });

    if (error) {
      alert(`เกิดข้อผิดพลาดไม่ทราบสาเหตุ`);
      console.error(error);
      loading = false;
      return;
    }

    loading = false;
    eligibility = data;
  }
</script>

{#if loading}
  <div class="w-full h-screen bg-yellow flex items-center justify-center">
    <p class="text-yellow-800">
      กำลังโหลด...
    </p>
  </div>
{:else if eligibility == null}{:else}
  <VoteRouter {candidateImages} />
{/if}
