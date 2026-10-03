<script lang="ts">
  import CandidateCard from "./CandidateCard.svelte";
  import {
    candidates,
    running_positions,
    type Candidate,
    type SupportedLanguage,
  } from "@repo/constants";
  import { i18n } from "@/lib/i18n";
  import { locale } from "@/lib/utils";

  type CandidateId = Candidate["candidate_id"];

  type Position = string;
  type Choice = string;
  interface Props {
    images: Map<CandidateId, string>;
    onSubmit: () => any;
    votes: Record<Position, Choice>;
  }

  const { images = new Map(), onSubmit, votes = $bindable() }: Props = $props();

  const t = $derived(i18n[locale.current]);
  const langId = $derived(locale.current);

  function getPositionName(id: string) {
    return running_positions.find((it) => it.position_id === id)!.name[langId];
  }

  function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    onSubmit();
  }
</script>

<h1 class="text-xl font-bold text-center mt-16 mb-3 whitespace-pre-line">
  {t.votePageTitle}
</h1>
<h2 class="text-base text-gray-500 text-center mb-9 whitespace-pre-line">
  {t.votePageSubtitle}
</h2>

<form {onsubmit}>
  {#each running_positions as position}
    {@const positionCandidates = candidates.filter((c) => c.position_id === position.position_id)}
    {@const singleCandidate = positionCandidates.length === 1}
    <section class="w-full mb-8">
      <h3 class="text-xl font-semibold">
        {t.position}{getPositionName(position.position_id)}
      </h3>

      <p class="text-gray-600 mb-6">
        {singleCandidate ? t.instruction : t.selectCandidateInstruction}
      </p>

      {#each positionCandidates as c, index}
        <CandidateCard
          candidate={c}
          candidateNumber={index + 1}
          image={images.get(c.candidate_id)}
        />
      <div class="space-y-2">
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[position.position_id]}
            name={position.position_id}
            value={c.candidate_id}
            class="h-5 w-5"
            required
          />
          <span class="text-gray-700">{singleCandidate ? t.approve : `${t.selectCandidate} ${c.candidate_number ?? index + 1}: ${c.full_name}`}</span>
        </label>
      </div>
      <div class="mb-6"></div>
      {/each}
      <div class="space-y-2">
        {#if singleCandidate}
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[position.position_id]}
            name={position.position_id}
            value="disapprove"
            class="h-5 w-5"
          />
          <span class="text-gray-700">{t.disapprove}</span>
        </label>
        {/if}
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[position.position_id]}
            name={position.position_id}
            value="no-vote"
            class="h-5 w-5"
          />
          <span class="text-gray-700">{singleCandidate ? t.abstain : t.noVote}</span>
        </label>
      </div>
    </section>
  {/each}

  <hr class="my-8 border-gray-300" />

  <div class="flex items-center justify-center pb-16">
    <button
      class="bg-yellow hover:bg-yellow/90 px-8 py-2.5 font-medium shadow rounded-md"
    >
      {t.confirm}
    </button>
  </div>
</form>
