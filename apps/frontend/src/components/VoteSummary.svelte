<script lang="ts">
  import { candidates, running_positions, type SupportedLanguage } from "@repo/constants";
  import CandidateCard from "./CandidateCard.svelte";
  import { i18n } from "@/lib/i18n";
  import { locale } from "@/lib/utils";

  interface Props {
    images: Map<string, string>;
    votes: Record<string, string>;
    onBack: () => any;
    onConfirm: () => Promise<any>;
  }

  let { votes, images, onBack, onConfirm }: Props = $props();

  const t = $derived(i18n[locale.current]);
  const langId = $derived(locale.current);

  function getPositionName(id: string) {
    return running_positions.find((it) => it.position_id === id)!.name[langId];
  }
</script>

<!-- REwrite needed, if there are more than 1 party -->
<h1 class="text-xl font-bold text-center mt-16">{t.reviewTitle}</h1>
<h2 class="text-base text-gray-500 text-center text-pretty">
  {t.reviewSubtitle}
</h2>

<div class="space-y-8">
  {#each candidates as c, index}
    {@const vote = votes[c.position_id]}
    <section class="mb-12 mt-12">
      <h3 class="text-xl font-semibold mb-4">
        {t.position}{getPositionName(c.position_id)}
      </h3>

      <CandidateCard
        candidate={c}
        candidateNumber={1}
        image={images.get(c.candidate_id)}
      />

      <div class="mt-4 font-semibold">
        {#if vote === c.candidate_id}
          <span
            class="px-4 py-2 rounded-lg bg-green-100 text-green-800 border-green-300 border"
          >
            {t.approve}
          </span>
        {:else if vote === "disapprove"}
          <span
            class="px-4 py-2 rounded-lg bg-red-100 text-red-800 border-red-300 border"
          >
            {t.disapprove}
          </span>
        {:else if vote === "no-vote"}
          <span
            class="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-800 border-neutral-300 border"
          >
            {t.abstain}
          </span>
        {/if}
      </div>
    </section>
  {/each}
</div>

<div class="flex gap-2 items-center justify-center pb-16">
  <button
    onclick={() => onBack()}
    class="bg-neutral-100 hover:bg-neutral-100/50 px-8 py-2.5 font-medium shadow rounded-md"
  >
    {t.editVote}
  </button>

  <button
    onclick={() => onConfirm()}
    class="bg-yellow hover:bg-yellow/90 px-8 py-2.5 font-medium shadow rounded-md"
  >
    {t.confirm}
  </button>
</div>
