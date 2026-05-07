<script lang="ts">
  import VotePage from "@/components/VotePage.svelte";
  import LogoImg from "@/assets/logo-black.png";
  import { event, type SupportedLanguage } from "@repo/constants";
  import { i18n } from "@/lib/i18n";
  import VoteSummary from "./VoteSummary.svelte";
  import { api, authHeader } from "@/lib/api";

  type Page = "vote" | "review";

  interface Props {
    candidateImages: [string, string][]; // we cant pass map from astro (i think)
  }

  let { candidateImages }: Props = $props();
  const images = $derived(new Map(candidateImages));

  let lang: SupportedLanguage = $state("th");
  let page = $state("vote" as Page);
  let votes: Record<string, string> = $state({});

  // this needed to be in global store
  const t = $derived(i18n[lang]);
  function toggleLanguage() {
    lang = lang === "th" ? "en" : "th";
  }

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
        headers: authHeader()!
      },
    );

    console.log({ data, error });
    if (error) {
      alert(`เกิดข้อผิดพลาด ${JSON.stringify(error)}`);
    } else {
      window.location.href = "/finish";
    }

    submitting = false;
  }
</script>


<div class="flex flex-col w-full h-auto bg-yellow select-none">
  <div class="pt-6 mb-4 px-10">
    <div class="flex justify-end mb-4">
      <button
        class="text-xs font-semibold border border-black/30 rounded-lg px-3 py-1 bg-white/40 hover:bg-white/70 transition"
        onclick={toggleLanguage}
      >
        {t.langToggle}
      </button>
    </div>

    <img
      src={LogoImg.src}
      alt="SMO Election Logo"
      class="w-20 mb-8 pointer-events-none"
    />

    <div>
      <h1 class="font-bold font-noto text-md">{t.eventTitle}</h1>
      <h2 class="font-light font-noto text-md mb-1">
        {t.eventSubtitle}
      </h2>
      <h4 class="font-light font-noto text-xs text-lgray">
        {lang === "th" ? event.full_name : "Academic Year 2026"}
      </h4>
      <div class="mt-6">
        <p class="text-center text-lgray font-light text-xs">
          คุณกำลังเข้าสู่ระบบด้วยบัญชี
          <span class="font-normal"> 62734678347@student.chula.ac.th </span>
        </p>
      </div>
    </div>
  </div>

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
</div>
