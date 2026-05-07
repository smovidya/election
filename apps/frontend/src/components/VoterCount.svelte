<script lang="ts">
  import { i18n } from "@/lib/i18n";
  import { locale } from "@/lib/utils";
  import type { SupportedLanguage } from "@repo/constants";

  interface Props {
    totalVotes?: number;
    loading?: boolean;
  }

  let { totalVotes = 326, loading = false }: Props = $props();

  const t = $derived(i18n[locale.current]);

  let currentCount = $state(0);

  $effect(() => {
    let start = 0;
    let end = totalVotes;
    let duration = 2000;
    let startTime = performance.now();
    let animationFrame: number;

    loading = false; // We start animating immediately when totalVotes is provided

    function updateCount(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      currentCount = Math.floor(progress * (end - start) + start);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    }

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="flex flex-col items-center">
  <h3 class="font-noto text-dgray text-center text-md mb-2">
    {t.totalVoters}
  </h3>

  <h1
    id="counter"
    class="font-museo text-center text-dgray text-4xl mb-2"
    class:animate-pulse={loading}
  >
    {loading ? t.loading : `${currentCount.toLocaleString()}${t.voterSuffix}`}
  </h1>
  <h3 class="font-noto text-dgray text-center text-sm">
    {t.eligibleVoters}
  </h3>
</div>

<style>
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  .animate-pulse {
    animation: pulse 1s infinite;
  }
</style>
