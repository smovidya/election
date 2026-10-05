<script lang="ts">
import { onMount } from "svelte";
import { candidates, running_positions, event } from "@repo/constants";
import { api } from "@/lib/api";
import { electionNow } from "@/lib/clock";
import { i18n } from "@/lib/i18n";
import { locale } from "@/lib/utils";

let { candidateImages }: { candidateImages: Record<string, string> } = $props();
const t = $derived(i18n[locale.current]);
type Result = {
  totalVotes: number;
  votesByPosition: Record<string, Record<string, number>>;
};
let available = $state(false);
let result = $state<Result | null>(null);
let failed = $state(false);
let loading = $state(false);

async function loadResults() {
  loading = true;
  failed = false;
  try {
    const response = await api.election.result.get();
    if (response.error || !response.data) throw new Error("Failed to fetch results");
    result = response.data;
  } catch {
    failed = true;
  } finally {
    loading = false;
  }
}

onMount(() => {
  const update = () => {
    const show = event.resultStatus !== "hidden" && electionNow() >= event.votingEnd.getTime();
    if (show && !available) void loadResults();
    available = show;
  };
  update();
  const timer = setInterval(update, 1000);
  return () => clearInterval(timer);
});

function percentage(count: number, votes: Record<string, number>) {
  const total = Object.values(votes).reduce((sum, value) => sum + value, 0);
  return `${(total === 0 ? 0 : count / total * 100).toFixed(1)}%`;
}
</script>

{#if available}
  <section class="w-full bg-white font-noto" aria-labelledby="results-title">
    <h2 id="results-title" class="mb-6 text-center text-xl font-bold">
      {event.resultStatus === "official" ? t.officialResults : t.unofficialResults}
    </h2>
    {#if loading}
      <p role="status" class="text-center">{t.loadingData}</p>
    {:else if failed}
      <div role="alert" class="text-center">
        <p class="text-red-600">{t.resultsError}</p>
        <button onclick={loadResults} class="mt-4 rounded-lg bg-yellow px-4 py-2">{t.retry}</button>
      </div>
    {:else if result}
      <p class="mb-8 text-center">{t.totalVoters}: <strong>{result.totalVotes.toLocaleString()}{t.voterSuffix}</strong></p>
      {#each running_positions as position}
        {@const votes = result.votesByPosition[position.position_id] ?? {}}
        {@const positionCandidates = candidates.filter(candidate => candidate.position_id === position.position_id)}
        <div class="mx-auto mb-8 w-full max-w-lg">
          <h3 class="mb-4 text-center font-semibold">{position.name[locale.current] ?? position.name.th}</h3>
          <ul class="flex flex-col gap-3">
            {#each positionCandidates as candidate}
              {@const count = votes[candidate.candidate_id] ?? 0}
              <li class="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                {#if candidateImages[candidate.candidate_id]}
                  <img src={candidateImages[candidate.candidate_id]} alt="" width="48" height="64" class="h-16 w-12 shrink-0 object-contain" />
                {/if}
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-600">{t.numberLabel} {candidate.candidate_number}</p>
                  <p class="text-sm font-semibold">{candidate.full_name}</p>
                </div>
                <span class="shrink-0 text-right text-sm font-bold">{count.toLocaleString()}{t.votesSuffix}<br /><span class="font-normal text-gray-600">{percentage(count, votes)}</span></span>
              </li>
            {/each}
            {#if positionCandidates.length === 1}
              <li class="flex justify-between rounded-xl bg-gray-100 p-4 text-sm">
                <span>{t.disapprove}</span>
                <span>{(votes.disapprove ?? 0).toLocaleString()}{t.votesSuffix} ({percentage(votes.disapprove ?? 0, votes)})</span>
              </li>
            {/if}
            <li class="flex justify-between rounded-xl bg-gray-100 p-4 text-sm">
              <span>{t.abstain}</span>
              <span>{(votes["no-vote"] ?? 0).toLocaleString()}{t.votesSuffix} ({percentage(votes["no-vote"] ?? 0, votes)})</span>
            </li>
          </ul>
        </div>
      {/each}
    {/if}
  </section>
{/if}
