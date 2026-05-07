<script lang="ts">
  import { parties, type Candidate, type SupportedLanguage } from "@repo/constants";
  import { getContext } from "svelte";
  import { i18n } from "@/lib/i18n";

  interface Props {
    candidate: Candidate;
    image?: string;
    candidateNumber: number;
  }

  const { candidate: c, image, candidateNumber }: Props = $props();

  const getLang = getContext<() => SupportedLanguage>("lang");
  const t = $derived(getLang ? i18n[getLang()] : i18n["th"]);
  const langId = $derived(getLang ? getLang() : "th");
</script>

<div class="flex h-32 mb-6 gap-1">
  <div
    class="flex flex-col w-1/5 items-center justify-center bg-purple-100 shadow-lg"
  >
    <span class="text-sm font-bold text-purple-900">{t.numberLabel}</span>
    <span class="text-2xl font-bold text-purple-900">{candidateNumber}</span>
  </div>

  <div class="p-3 w-3/5 bg-white shadow-lg">
    <p class="font-bold text-sm">
      {t.party}{parties.find((it) => it.party_id === c.party_id)!.name[langId]}
    </p>
    <p class="font-bold text-sm">{c.full_name}</p>
    <div class="h-2.5"></div>
    <p class="text-gray-600 text-xs">{c.study_program[langId]}</p>
    <p class="text-gray-600 text-xs">{t.yearLabel} {c.study_year}</p>
  </div>
  <img
    src={image}
    alt={c.candidate_id}
    class="object-cover shadow-lg bg-white"
    height={32}
    width={96}
  />
</div>
