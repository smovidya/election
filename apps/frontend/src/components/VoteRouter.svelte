<script lang="ts">
  import VotePage from "@/components/VotePage.svelte";
  import LogoImg from "@/assets/logo-black.png";
  import { event, type SupportedLanguage } from "@repo/constants";
  import { i18n } from "@/lib/i18n";
  import VoteSummary from "./VoteSummary.svelte";
  import { api, authHeader } from "@/lib/api";

  import { getContext } from "svelte";

  type Page = "vote" | "review";

  interface Props {
    candidateImages: [string, string][]; // we cant pass map from astro (i think)
  }

  let { candidateImages }: Props = $props();
  const images = $derived(new Map(candidateImages));

  const getLang = getContext<() => SupportedLanguage>("lang");
  const t = $derived(i18n[getLang()]);

  let page = $state("vote" as Page);
  let votes: Record<string, string> = $state({});
  

  let submitting = $state(false);
  async function sumbitVote() {
    if (submitting) {
      return;
    }
    submitting = true;

    const token = window.localStorage.getItem("session_token");
    if (!token) {
      console.error("No token found");
      submitting = false;
      return;
    }

    const formattedVotes = [];
    for (const [key, value] of Object.entries(votes)) {
      formattedVotes.push({
        choice: value,
        position: key,
      });
    }

    const { error, data } = await api.election["cast-vote"].post(
      {
        votes: formattedVotes as any,
      },
      {
        headers: authHeader()!,
      },
    );

    console.log({ data, error });
    if (error) {
      alert(`${t.errorPrefix} ${JSON.stringify(error)}`);
    } else {
      window.location.href = "/finish";
    }

    submitting = false;
  }
</script>

<div
  class="flex flex-col w-full font-noto rounded-t-4xl bg-white items-center px-10"
>
  {#if page === "vote"}
    <VotePage
      {images}
      bind:votes
      onSubmit={() => {
        page = "review";
      }}
    />
  {:else}
    <VoteSummary
      {images}
      {votes}
      onBack={() => {
        page = "vote";
      }}
      onConfirm={async () => {
        await sumbitVote();
      }}
    />
  {/if}
</div>
