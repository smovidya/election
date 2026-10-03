<script lang="ts">
import {
	parties,
	getCandidateParty,
	type Candidate,
	type SupportedLanguage,
} from "@repo/constants";
import { i18n } from "@/lib/i18n";
import { locale } from "@/lib/utils";

interface Props {
	candidate: Candidate;
	image?: string;
	candidateNumber: number;
}

const { candidate: c, image, candidateNumber }: Props = $props();

const t = $derived(i18n[locale.current]);
const langId = $derived(locale.current);
const party = $derived(getCandidateParty(c, parties));
</script>

<div class="flex h-32 mb-6 gap-1">
  <div
    class="flex flex-col w-1/5 items-center justify-center shadow-lg"
    style="background: {c.color ?? party?.color ?? '#6b7280'};"
  >
    <span class="text-xs font-bold text-white">{t.numberLabel}</span>
    <span class="text-2xl font-bold text-white">{c.candidate_number ?? candidateNumber}</span>
  </div>

  <div class="p-3 w-3/5 bg-white shadow-lg">
    <p class="font-bold text-sm">
      {party ? t.party + (party.name[langId] ?? party.name.th ?? '') : t.independentCandidate}
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
