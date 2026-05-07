<script lang="ts">
  import CandidateCard from "./CandidateCard.svelte";
  import {
    candidates,
    running_positions,
    type Candidate,
  } from "@repo/constants";

  type CandidateId = Candidate["candidate_id"];

  interface Props {
    images: Map<CandidateId, string>;
    onSubmit: () => any;
    votes: Record<Position, Choice>;
  }

  const { images = new Map(), onSubmit, votes = $bindable() }: Props = $props();

  function getPositionName(id: string) {
    return running_positions.find((it) => it.position_id === id)!.name.th;
  }

  function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    onSubmit();
  }
</script>

<h1 class="text-xl font-bold text-center mt-16 mb-3">
  ลงคะแนนเลือกตั้ง<br />คณะกรรมการบริหารสโมสรนิสิต
</h1>
<h2 class="text-base text-gray-500 text-center mb-9">
  คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย<br />ประจำปีการศึกษา 2568
</h2>

<form {onsubmit}>
  <!-- TODO: if we have multiple candidate per pos, this is needed to be rewrite -->
  {#each candidates as c}
    <section class="w-full mb-8">
      <h3 class="text-xl font-semibold">
        ตำแหน่ง{getPositionName(c.position_id)}
      </h3>

      <p class="text-gray-600 mb-6">
        กรุณาเลือก รับรอง ไม่รับรอง หรืองดออกเสียง
      </p>

      <CandidateCard
        candidate={c}
        candidateNumber={1}
        image={images.get(c.candidate_id)}
      />

      <div class="space-y-2">
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[c.position_id]}
            name={c.candidate_id}
            value={c.candidate_id}
            class="h-5 w-5"
            required
          />
          <span class="text-gray-700">รับรอง</span>
        </label>
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[c.position_id]}
            name={c.candidate_id}
            value="disapprove"
            class="h-5 w-5"
          />
          <span class="text-gray-700">ไม่รับรอง</span>
        </label>
        <label class="flex items-center space-x-3">
          <input
            type="radio"
            bind:group={votes[c.position_id]}
            name={c.candidate_id}
            value="no-vote"
            class="h-5 w-5"
          />
          <span class="text-gray-700">งดออกเสียง</span>
        </label>
      </div>
    </section>
  {/each}
  <!-- President -->

  <hr class="my-8 border-gray-300" />

  <div class="flex items-center justify-center pb-16">
    <button
      class="bg-yellow hover:bg-yellow/90 px-8 py-2.5 font-medium shadow rounded-md"
    >
      ยืนยัน
    </button>
  </div>
</form>
