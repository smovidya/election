<script lang="ts">
  // unfinished
  import CandidateCard from "@/components/CandidateCard.svelte";
  import VoterCount from "@/components/VoterCount.svelte";
  import { candidates } from "@repo/constants";
  import { api } from "@/lib/api";

  // Assuming Position and Choice types as specified
  type Position = string;
  type Choice = string | "disapprove" | "no-vote";

  type ElectionResultType = {
    totalVotes: number;
    votesByPosition: Record<Position, Record<Choice, number>>;
  };

  const getResults = async () => {
    // const res = await api.election.result.get();
    // if (res.error) throw new Error("Failed to fetch results");
    // return res.data as ElectionResultType;
    const res: ElectionResultType = {
      totalVotes: 1323,
      votesByPosition: {
        sfds: {
          "no-vote": 1223,
          disapprove: 1223,
          c1: 1,
        },
      },
    };

    return res;
  };

  let resultsPromise = getResults();

  const calculatePercent = (count: number, total: number) => {
    if (total === 0) return "0.0%";
    return `${((count / total) * 100).toFixed(1)}%`;
  };

  // Process candidates from result
  const getPositions = (result: ElectionResultType) => {
    return Object.entries(result.votesByPosition)
      .map(([positionId, votes]) => {
        // Calculate total votes for this position
        const totalVotesForPosition = Object.values(votes).reduce(
          (sum, count) => sum + count,
          0,
        );

        const disapproveCount = votes["disapprove"] || 0;

        // Create an array of candidate results for this position
        const candidateResults = Object.entries(votes)
          .filter(
            ([choice, _]) => choice !== "disapprove" && choice !== "no-vote",
          )
          .map(([candidateId, count], index) => {
            const candidateInfo = candidates.find(
              (c) => c.candidate_id === candidateId,
            );
            return {
              position: positionId,
              candidateNumber: index + 1,
              candidate: candidateInfo,
              image: candidateInfo?.image,
              approve: calculatePercent(count, totalVotesForPosition),
              abstain: calculatePercent(
                votes["no-vote"] || 0,
                totalVotesForPosition,
              ),
              disapprove: calculatePercent(
                disapproveCount,
                totalVotesForPosition,
              ),
              votesReceivedCount: `${count} เสียง`,
              disapproveCount: `${disapproveCount} เสียง`,
              abstainCount: `${votes["no-vote"] || 0} เสียง`,
            };
          });

        return candidateResults;
      })
      .flat();
  };
</script>

{#await resultsPromise}
  <div class="py-20 text-center font-noto">กำลังโหลดข้อมูล...</div>
{:then result}
  <div
    class="shadow-lg bg-white min-w-full h-54 rounded-2xl flex flex-col items-center justify-center mb-8"
  >
    <VoterCount totalVotes={result.totalVotes} />
  </div>

  <div class="px-10 mt-8 w-full max-w-md flex flex-col gap-10 mb-8">
    {#each getPositions(result) as resultItem}
      {#if resultItem.candidate}
        <div class="flex flex-col gap-2">
          <CandidateCard
            candidate={resultItem.candidate}
            image={resultItem.image}
            candidateNumber={resultItem.candidateNumber}
          />
          <div
            class="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-2 text-sm font-noto"
          >
            <div class="flex justify-between">
              <span>เห็นชอบ</span>
              <span class="font-bold text-green-600"
                >{resultItem.votesReceivedCount} ({resultItem.approve})</span
              >
            </div>
            <div class="flex justify-between">
              <span>ไม่เห็นชอบ</span>
              <span class="font-bold text-red-600"
                >{resultItem.disapproveCount} ({resultItem.disapprove})</span
              >
            </div>
            <div class="flex justify-between">
              <span>งดออกเสียง</span>
              <span class="font-bold text-gray-600"
                >{resultItem.abstainCount} ({resultItem.abstain})</span
              >
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
{:catch error}
  <div class="py-20 text-center font-noto text-red-500">
    เกิดข้อผิดพลาดในการโหลดข้อมูลผลการเลือกตั้ง
  </div>
{/await}
