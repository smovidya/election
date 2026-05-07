<script lang="ts">
  import { api, authHeader } from "@/lib/api";
  import { onMount } from "svelte";
  import VoteRouter from "./VoteRouter.svelte";
  import LogoImg from "@/assets/logo-black.png";
  import { event, type SupportedLanguage } from "@repo/constants";
  import { i18n } from "@/lib/i18n";
  import Redirect from "./Redirect.svelte";
  import { locale } from "@/lib/utils";

  interface Props {
    candidateImages: [string, string][]; // we cant pass map from astro (i think)
  }

  let { candidateImages }: Props = $props();

  // this needed to be in global store
  const t = $derived(i18n[locale.current]);
  function toggleLanguage() {
    locale.current = locale.current === "th" ? "en" : "th";
  }

  let eligibility = $state(null) as null | {
    reason?: string;
    eligible?: boolean;
  };

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
      alert(`${t.errorTitle}`);
      eligibility = {};
      return;
    }
    eligibility = data;
  }
</script>

<div class="flex flex-col w-full min-h-screen bg-yellow select-none">
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
        {locale.current === "th" ? event.full_name : "Academic Year 2026"}
      </h4>
      <div class="mt-6">
        <p class="text-center text-lgray font-light text-xs">
          {t.loginWith}
          <span class="font-normal"> 62734678347@student.chula.ac.th </span>
        </p>
      </div>
    </div>
  </div>

  {#if eligibility == null}
    <div class="w-full h-24 flex items-center justify-center">
      <p class="text-yellow-800">{t.loading}</p>
    </div>
  {:else if eligibility.eligible}
    <VoteRouter {candidateImages} />
  {:else}
    <Redirect href="/finish" />
  {/if}
</div>
